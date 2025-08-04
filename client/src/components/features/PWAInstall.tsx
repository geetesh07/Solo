import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner after a short delay for better UX
      setTimeout(() => {
        if (!standalone) {
          setShowInstallBanner(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show banner if not in standalone mode
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge installation
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted PWA installation');
      } else {
        console.log('User dismissed PWA installation');
      }
      
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isStandalone || !showInstallBanner || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <>
      {/* Mobile Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-slide-up">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-cyan-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Install Solo Hunter</h3>
                <p className="text-xs text-gray-400">Add to home screen for better experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              data-testid="button-dismiss-pwa"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {isIOS ? (
            // iOS Instructions
            <div className="space-y-2">
              <p className="text-xs text-gray-300">
                To install: Tap <span className="font-semibold">Share</span> → <span className="font-semibold">Add to Home Screen</span>
              </p>
              <div className="flex items-center space-x-2 text-xs text-cyan-400">
                <Download className="w-3 h-3" />
                <span>Available in Safari</span>
              </div>
            </div>
          ) : (
            // Chrome/Edge Install Button
            <button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              data-testid="button-install-pwa"
            >
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}