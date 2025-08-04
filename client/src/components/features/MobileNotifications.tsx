import { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';

export function MobileNotifications() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [lastNotification, setLastNotification] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Safely check notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (isRequesting) return; // Prevent multiple simultaneous requests
    
    setIsRequesting(true);
    setLastNotification('Requesting permission...');

    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        setLastNotification('Notifications not supported on this device');
        return;
      }

      // Mobile-safe permission request
      const permission = await new Promise<NotificationPermission>((resolve) => {
        try {
          // Use a timeout to prevent hanging
          const timeoutId = setTimeout(() => {
            console.log('Notification permission request timed out');
            resolve('denied');
          }, 8000); // 8 second timeout

          const handlePermission = (result: NotificationPermission) => {
            clearTimeout(timeoutId);
            resolve(result);
          };

          // Try modern promise-based API first
          const requestResult = Notification.requestPermission();
          
          if (requestResult && typeof requestResult.then === 'function') {
            requestResult.then(handlePermission).catch(() => {
              clearTimeout(timeoutId);
              resolve('denied');
            });
          } else {
            // Fallback for older browsers
            Notification.requestPermission(handlePermission);
          }
        } catch (error) {
          console.error('Permission request error:', error);
          resolve('denied');
        }
      });

      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setLastNotification('✅ Notification permission granted!');
        // Test notification after permission granted
        setTimeout(() => {
          showTestNotification();
        }, 1000);
      } else if (permission === 'denied') {
        setLastNotification('❌ Notification permission denied');
      } else {
        setLastNotification('⚠️ Permission request dismissed');
      }
    } catch (error) {
      console.error('Notification permission error:', error);
      setLastNotification('❌ Failed to request permission');
    } finally {
      setIsRequesting(false);
    }
  };

  const showTestNotification = () => {
    if (!('Notification' in window)) {
      setLastNotification('❌ Notifications not supported');
      return;
    }

    if (notificationPermission !== 'granted') {
      setLastNotification('❌ Permission required');
      return;
    }

    try {
      // Create simple, mobile-friendly notification
      const notification = new Notification('Solo Hunter Test', {
        body: 'Notification system working!',
        tag: 'test-notification',
        silent: false,
        requireInteraction: false
      });

      // Auto-close after 4 seconds
      setTimeout(() => {
        try {
          notification.close();
        } catch (e) {
          // Ignore close errors
        }
      }, 4000);

      // Handle click
      notification.onclick = () => {
        try {
          window.focus();
          notification.close();
        } catch (e) {
          // Ignore errors
        }
      };

      // Handle errors
      notification.onerror = (error) => {
        console.error('Notification error:', error);
        setLastNotification('❌ Notification failed to display');
      };

      setLastNotification('✅ Test notification sent!');
    } catch (error) {
      console.error('Notification creation error:', error);
      setLastNotification('❌ Failed to create notification');
    }
  };

  return (
    <div className="mystical-card p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            MOBILE NOTIFICATIONS
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {notificationPermission === 'granted' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <div className="text-white font-medium text-sm">Push Notifications</div>
              <div className={`text-xs ${
                notificationPermission === 'granted' ? 'text-green-400' : 
                notificationPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {notificationPermission === 'granted' ? 'Enabled' : 
                 notificationPermission === 'denied' ? 'Blocked' : 'Not Requested'}
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            notificationPermission === 'granted' ? 'bg-green-400' : 
            notificationPermission === 'denied' ? 'bg-red-400' : 'bg-yellow-400'
          }`} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              disabled={isRequesting}
              className={`w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isRequesting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
              }`}
              data-testid="button-request-mobile-permission"
            >
              {isRequesting ? 'Requesting Permission...' : 'Enable Notifications'}
            </button>
          )}
          
          <button
            onClick={showTestNotification}
            disabled={notificationPermission !== 'granted'}
            className={`w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              notificationPermission === 'granted'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            data-testid="button-test-mobile-notification"
          >
            Send Test Notification
          </button>
        </div>

        {/* Status Message */}
        {lastNotification && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-white text-sm font-medium mb-1">Status:</div>
            <div className="text-gray-300 text-xs">{lastNotification}</div>
          </div>
        )}

        {/* Mobile Tips */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-300 text-sm font-medium mb-2">Mobile Tips:</h3>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Allow notifications when prompted by your browser</li>
            <li>• Check your browser settings if blocked</li>
            <li>• Notifications work best when app is installed as PWA</li>
            <li>• Test notifications will auto-close after 4 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}