import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Check, X, Settings } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface NotificationSettings {
  enabled: boolean;
  reminders: boolean;
  dailyGoals: boolean;
  streakAlerts: boolean;
  sound: boolean;
  vibration: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export function PhoneNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('phone-notification-settings');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      reminders: true,
      dailyGoals: true,
      streakAlerts: true,
      sound: true,
      vibration: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Register service worker for background notifications
    registerServiceWorker();

    // Set up periodic notification checks
    setupNotificationScheduler();
  }, []);

  useEffect(() => {
    localStorage.setItem('phone-notification-settings', JSON.stringify(settings));
  }, [settings]);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        setServiceWorkerReady(true);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('App updated! Refresh to get the latest features.', 'info');
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported on this device', 'error');
      return false;
    }

    setIsRegistering(true);

    try {
      // Request basic notification permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        // Test notification
        await sendTestNotification();
        
        // Try to register for push notifications if available
        await registerPushNotifications();
        
        setSettings(prev => ({ ...prev, enabled: true }));
        showToast('Phone notifications enabled!', 'success');
        return true;
      } else {
        showToast('Notification permission denied. Enable in browser settings.', 'error');
        return false;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      showToast('Failed to enable notifications. Try manually in browser settings.', 'error');
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const registerPushNotifications = async () => {
    if (!serviceWorkerReady || !('PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (!existingSubscription) {
        // Create new subscription
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: await getVapidKey()
        });
        
        // Store subscription on server (if we had a backend endpoint)
        console.log('Push subscription created:', subscription);
      }
    } catch (error) {
      console.error('Push notification registration failed:', error);
    }
  };

  const getVapidKey = async () => {
    // In a real app, you'd get this from your server
    // For now, we'll use a placeholder that would work with a proper backend
    const vapidKey = 'BGxraCBJcyBhIHZhcGlkIGtleSBmb3IgZGVtbyBwdXJwb3Nlcw';
    return Uint8Array.from(atob(vapidKey), c => c.charCodeAt(0));
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') return;

    const notification = new Notification('Solo Hunter Ready!', {
      body: 'Your quest reminders are now active on this device.',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'test-notification',
      requireInteraction: false,
      silent: !settings.sound,
      vibrate: settings.vibration ? [200, 100, 200] : []
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  };

  const setupNotificationScheduler = () => {
    // Clear existing intervals
    const existingInterval = localStorage.getItem('notification-interval-id');
    if (existingInterval) {
      clearInterval(parseInt(existingInterval));
    }

    if (!settings.enabled || permission !== 'granted') return;

    // Set up periodic checks every 15 minutes
    const intervalId = setInterval(() => {
      checkForNotifications();
    }, 15 * 60 * 1000);

    localStorage.setItem('notification-interval-id', intervalId.toString());
  };

  const checkForNotifications = () => {
    if (!settings.enabled || permission !== 'granted') return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check quiet hours
    if (settings.quietHours.enabled) {
      const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
      const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
      const quietStart = startHour * 60 + startMin;
      const quietEnd = endHour * 60 + endMin;

      if (quietStart > quietEnd) {
        // Overnight quiet hours (e.g., 22:00 to 08:00)
        if (currentTime >= quietStart || currentTime <= quietEnd) return;
      } else {
        // Same day quiet hours
        if (currentTime >= quietStart && currentTime <= quietEnd) return;
      }
    }

    // Check for due goals and send notifications
    checkDueGoals();
    checkDailyStreaks();
  };

  const checkDueGoals = () => {
    if (!settings.reminders) return;

    const goals = JSON.parse(localStorage.getItem('hunter-categories-with-goals') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    goals.forEach((category: any) => {
      category.goals.forEach((goal: any) => {
        if (!goal.completed && goal.dueDate === today) {
          sendGoalReminder(goal.title, category.name);
        }
      });
    });
  };

  const checkDailyStreaks = () => {
    if (!settings.streakAlerts) return;

    const lastStreakCheck = localStorage.getItem('last-streak-notification');
    const today = new Date().toDateString();
    
    if (lastStreakCheck !== today) {
      const now = new Date();
      if (now.getHours() >= 20) { // Evening reminder
        sendStreakReminder();
        localStorage.setItem('last-streak-notification', today);
      }
    }
  };

  const sendGoalReminder = (goalTitle: string, categoryName: string) => {
    if (permission !== 'granted') return;

    new Notification(`Quest Due Today!`, {
      body: `"${goalTitle}" in ${categoryName} needs your attention.`,
      icon: '/icon-192x192.png',
      tag: `goal-${goalTitle}`,
      requireInteraction: true,
      silent: !settings.sound,
      vibrate: settings.vibration ? [300, 100, 300, 100, 300] : []
    });
  };

  const sendStreakReminder = () => {
    if (permission !== 'granted') return;

    new Notification('Keep Your Streak Alive!', {
      body: 'Complete your daily quests to maintain your Hunter streak.',
      icon: '/icon-192x192.png',
      tag: 'streak-reminder',
      requireInteraction: false,
      silent: !settings.sound,
      vibrate: settings.vibration ? [200, 100, 200] : []
    });
  };

  const disableNotifications = () => {
    setSettings(prev => ({ ...prev, enabled: false }));
    
    // Clear scheduled intervals
    const intervalId = localStorage.getItem('notification-interval-id');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
      localStorage.removeItem('notification-interval-id');
    }
    
    showToast('Phone notifications disabled', 'info');
  };

  const isQuietTime = () => {
    if (!settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
    const quietStart = startHour * 60 + startMin;
    const quietEnd = endHour * 60 + endMin;

    if (quietStart > quietEnd) {
      return currentTime >= quietStart || currentTime <= quietEnd;
    } else {
      return currentTime >= quietStart && currentTime <= quietEnd;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Phone Notifications</h3>
            <p className="text-sm text-gray-400">
              {permission === 'granted' && settings.enabled ? 'Active' : 
               permission === 'denied' ? 'Blocked' : 'Not configured'}
              {isQuietTime() && settings.enabled && ' • Quiet hours'}
            </p>
          </div>
        </div>
        
        {permission === 'granted' && settings.enabled ? (
          <button
            onClick={disableNotifications}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            data-testid="button-disable-notifications"
          >
            <BellOff className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={requestPermission}
            disabled={isRegistering || permission === 'denied'}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              permission === 'denied' 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            data-testid="button-enable-notifications"
          >
            {isRegistering ? 'Setting up...' : permission === 'denied' ? 'Blocked' : 'Enable'}
          </button>
        )}
      </div>

      {permission === 'granted' && settings.enabled && (
        <div className="space-y-4">
          {/* Notification Types */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Notification Types</h4>
            {[
              { key: 'reminders', label: 'Quest Reminders', desc: 'Due date alerts' },
              { key: 'dailyGoals', label: 'Daily Goals', desc: 'Morning motivation' },
              { key: 'streakAlerts', label: 'Streak Alerts', desc: 'Evening reminders' }
            ].map(type => (
              <label key={type.key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer">
                <div>
                  <div className="text-sm text-white">{type.label}</div>
                  <div className="text-xs text-gray-400">{type.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings[type.key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setSettings(prev => ({ ...prev, [type.key]: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            ))}
          </div>

          {/* Sound & Vibration */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Alerts</h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-white">Sound</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.vibration}
                  onChange={(e) => setSettings(prev => ({ ...prev, vibration: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-white">Vibration</span>
              </label>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <h4 className="text-sm font-medium text-gray-300">Quiet Hours</h4>
              <input
                type="checkbox"
                checked={settings.quietHours.enabled}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  quietHours: { ...prev.quietHours, enabled: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">From</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">To</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Button */}
          <button
            onClick={sendTestNotification}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            data-testid="button-test-notification"
          >
            Send Test Notification
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-300">Notifications Blocked</h4>
              <p className="text-xs text-red-200 mt-1">
                Enable notifications in your browser settings, then refresh this page.
              </p>
              <p className="text-xs text-red-200 mt-2">
                Chrome: Settings → Privacy → Notifications → Allow
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}