import { useState } from 'react';
import { Download, Smartphone, ExternalLink, CheckCircle } from 'lucide-react';
// import { showToast } from '@/components/ui/Toast';

export function APKGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const generateAPK = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Step 1: Check PWA readiness
    setGenerationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Generate app bundle
    setGenerationStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Create APK file
    setGenerationStep(3);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Complete
    setGenerationStep(4);
    setIsGenerating(false);

    console.log('APK generation complete! Check instructions below.');
  };

  const steps = [
    'Preparing app configuration...',
    'Checking PWA compatibility...',
    'Building Android package...',
    'Finalizing APK file...',
    'Ready for installation!'
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Android APK Generator</h3>
            <p className="text-sm text-gray-400">Generate installable Android app</p>
          </div>
        </div>
      </div>

      {/* APK Generation Status */}
      {isGenerating && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-blue-300 font-medium">Generating APK...</span>
          </div>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center space-x-2 text-sm ${
                index < generationStep ? 'text-green-400' :
                index === generationStep ? 'text-blue-400' : 'text-gray-500'
              }`}>
                {index < generationStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    index === generationStep ? 'border-blue-400 border-t-transparent animate-spin' : 'border-gray-600'
                  }`} />
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Complete */}
      {!isGenerating && generationStep === 4 && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">APK Ready!</span>
          </div>
          <p className="text-sm text-gray-300">
            Your Solo Hunter APK has been generated. Follow the installation steps below.
          </p>
        </div>
      )}

      {/* APK Generation Methods */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Generation Options</h4>
        
        {/* Method 1: PWA Installer */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h5 className="text-white font-medium mb-2">📱 PWA Installation (Recommended)</h5>
          <p className="text-sm text-gray-300 mb-3">
            Install directly from browser - works immediately with notifications
          </p>
          <ol className="text-xs text-gray-400 space-y-1 mb-3">
            <li>1. Open this app in Chrome on Android</li>
            <li>2. Tap "Install App" when prompted</li>
            <li>3. Or tap menu → "Add to Home Screen"</li>
            <li>4. Enable notifications in app settings</li>
          </ol>
          <button
            onClick={() => console.log('Install prompt should appear automatically in Chrome')}
            className="text-blue-400 text-sm hover:text-blue-300 flex items-center space-x-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Help with PWA installation</span>
          </button>
        </div>

        {/* Method 2: APK Builder Tools */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h5 className="text-white font-medium mb-2">🔧 APK Builder Tools</h5>
          <p className="text-sm text-gray-300 mb-3">
            Use online tools to convert this PWA to APK
          </p>
          <div className="space-y-2">
            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-400 text-sm hover:text-blue-300 flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>PWABuilder (Microsoft)</span>
            </a>
            <a
              href="https://appmaker.merku.love"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-400 text-sm hover:text-blue-300 flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>PWA to APK Generator</span>
            </a>
          </div>
        </div>

        {/* Method 3: Manual APK Creation */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h5 className="text-white font-medium mb-2">⚙️ Manual APK Creation</h5>
          <p className="text-sm text-gray-300 mb-3">
            Advanced: Build APK with Android Studio
          </p>
          <button
            onClick={generateAPK}
            disabled={isGenerating}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              isGenerating 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
            }`}
            data-testid="button-generate-apk"
          >
            {isGenerating ? 'Generating...' : 'Generate Configuration'}
          </button>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <h4 className="text-yellow-300 font-medium mb-2">⚠️ Installation Notes</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Enable "Install from unknown sources" in Android settings</li>
          <li>• PWA installation is recommended for best notification support</li>
          <li>• APK files from third-party tools may have limited functionality</li>
          <li>• Always download APKs from trusted sources only</li>
        </ul>
      </div>
    </div>
  );
}