import { useState, useEffect } from 'react';
import { serviceWorkerManager } from '@/lib/serviceWorker';
import { Wifi, WifiOff, Bell, BellOff, Smartphone, Download, CheckCircle, AlertCircle } from 'lucide-react';

export function ServiceWorkerStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [version, setVersion] = useState('unknown');
  const [pushSubscribed, setPushSubscribed] = useState(false);

  useEffect(() => {
    // Initialize service worker status
    checkServiceWorkerStatus();
    
    // Monitor online status
    serviceWorkerManager.onOnlineStatusChange(setIsOnline);
    
    // Check notification permission
    setNotificationPermission(Notification.permission);
    
    // Get service worker version
    serviceWorkerManager.getVersion().then(setVersion);
  }, []);

  const checkServiceWorkerStatus = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      setServiceWorkerReady(!!registration);
    }
  };

  const enableNotifications = async () => {
    const permission = await serviceWorkerManager.requestNotificationPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      const subscription = await serviceWorkerManager.subscribeToPushNotifications();
      setPushSubscribed(!!subscription);
    }
  };

  const testNotification = async () => {
    await serviceWorkerManager.showNotification({
      title: 'Test Notification 🧪',
      body: 'Service Worker notifications are working!',
      tag: 'test-notification'
    });
  };

  return (
    <div className="mystical-card p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            SERVICE WORKER STATUS
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {/* Online Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <div>
              <div className="text-white font-medium text-sm">Connection Status</div>
              <div className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>

        {/* Service Worker Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {serviceWorkerReady ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <div className="text-white font-medium text-sm">Service Worker</div>
              <div className={`text-xs ${serviceWorkerReady ? 'text-green-400' : 'text-yellow-400'}`}>
                {serviceWorkerReady ? `Active (${version})` : 'Initializing...'}
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${serviceWorkerReady ? 'bg-green-400' : 'bg-yellow-400'}`} />
        </div>

        {/* Notification Permission */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {notificationPermission === 'granted' ? (
              <Bell className="w-5 h-5 text-green-400" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <div className="text-white font-medium text-sm">Notifications</div>
              <div className={`text-xs ${
                notificationPermission === 'granted' ? 'text-green-400' : 
                notificationPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {notificationPermission === 'granted' ? 'Enabled' : 
                 notificationPermission === 'denied' ? 'Blocked' : 'Not Enabled'}
              </div>
            </div>
          </div>
          {notificationPermission !== 'granted' && (
            <button
              onClick={enableNotifications}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              data-testid="button-enable-notifications"
            >
              Enable
            </button>
          )}
        </div>

        {/* Push Subscription Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-medium text-sm">Push Notifications</div>
              <div className={`text-xs ${pushSubscribed ? 'text-green-400' : 'text-gray-400'}`}>
                {pushSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${pushSubscribed ? 'bg-green-400' : 'bg-gray-400'}`} />
        </div>

        {/* Test Notification Button */}
        {notificationPermission === 'granted' && (
          <button
            onClick={testNotification}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            data-testid="button-test-notification"
          >
            Test Notification
          </button>
        )}

        {/* Features List */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-300 text-sm font-medium mb-2">Active Features:</h3>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>✓ Offline functionality with cached content</li>
            <li>✓ Background data synchronization</li>
            <li>✓ Push notifications for reminders</li>
            <li>✓ Automatic app updates</li>
            <li>✓ Quest reminder scheduling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}