import { useState } from 'react';
import { Bell, BellRing, CheckCircle, AlertCircle } from 'lucide-react';

export function DevNotifications() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [lastNotification, setLastNotification] = useState<string>('');

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setLastNotification('Notifications not supported in this environment');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setLastNotification('Notification permission granted!');
      } else {
        setLastNotification('Notification permission denied');
      }
    } catch (error) {
      setLastNotification('Failed to request notification permission');
      console.error('Notification permission error:', error);
    }
  };

  const showTestNotification = () => {
    if (!('Notification' in window)) {
      setLastNotification('Notifications not supported');
      return;
    }

    if (notificationPermission !== 'granted') {
      setLastNotification('Notification permission required');
      return;
    }

    try {
      const notification = new Notification('Solo Hunter Test', {
        body: 'Development notification test successful!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'dev-test'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setLastNotification('Test notification sent successfully');
    } catch (error) {
      setLastNotification('Failed to show notification');
      console.error('Notification error:', error);
    }
  };

  return (
    <div className="mystical-card p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <BellRing className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DEV NOTIFICATIONS
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {/* Notification Permission Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {notificationPermission === 'granted' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <div className="text-white font-medium text-sm">Browser Notifications</div>
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
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
              data-testid="button-request-permission"
            >
              Request Notification Permission
            </button>
          )}
          
          <button
            onClick={showTestNotification}
            disabled={notificationPermission !== 'granted'}
            className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              notificationPermission === 'granted'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            data-testid="button-test-notification"
          >
            Send Test Notification
          </button>
        </div>

        {/* Status Message */}
        {lastNotification && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-white text-sm font-medium mb-1">Last Action:</div>
            <div className="text-gray-300 text-xs">{lastNotification}</div>
          </div>
        )}

        {/* Hunter Notification Presets */}
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h3 className="text-purple-300 text-sm font-medium mb-2">Hunter Notification Types:</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => showTestNotification()}
              disabled={notificationPermission !== 'granted'}
              className={`px-3 py-2 rounded text-xs ${
                notificationPermission === 'granted'
                  ? 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200'
                  : 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              🎯 Quest Reminder
            </button>
            <button
              onClick={() => showTestNotification()}
              disabled={notificationPermission !== 'granted'}
              className={`px-3 py-2 rounded text-xs ${
                notificationPermission === 'granted'
                  ? 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200'
                  : 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              🔥 Streak Alert
            </button>
            <button
              onClick={() => showTestNotification()}
              disabled={notificationPermission !== 'granted'}
              className={`px-3 py-2 rounded text-xs ${
                notificationPermission === 'granted'
                  ? 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200'
                  : 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              ⚡ Level Up
            </button>
            <button
              onClick={() => showTestNotification()}
              disabled={notificationPermission !== 'granted'}
              className={`px-3 py-2 rounded text-xs ${
                notificationPermission === 'granted'
                  ? 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200'
                  : 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              🌅 Daily Motivation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}