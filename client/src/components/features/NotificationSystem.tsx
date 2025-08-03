import { useState, useEffect } from "react";
import { Bell, Settings, X, Check } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
  weekly?: boolean;
}

export function NotificationSystem({ isOpen, onClose }: NotificationSystemProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('notification-reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Daily Quest Reminder', time: '09:00', enabled: false },
      { id: '2', title: 'Evening Review', time: '18:00', enabled: false },
      { id: '3', title: 'Weekly Goals Check', time: '10:00', enabled: false, weekly: true }
    ];
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    console.log('Requesting notification permission...');
    
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        console.log('Permission result:', result);
        setPermission(result);
        
        if (result === 'granted') {
          console.log('Permission granted, creating welcome notification...');
          
          // Create immediate test notification
          const welcomeNotification = new Notification('🎯 Hunter System Online!', {
            body: 'Notifications enabled! You\'ll receive quest reminders and updates.',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'welcome-notification',
            requireInteraction: false
          });
          
          welcomeNotification.onclick = () => {
            console.log('Welcome notification clicked!');
            window.focus();
            welcomeNotification.close();
          };
          
          showToast({
            type: 'success',
            title: 'Notifications Enabled!',
            message: 'You should see a welcome notification now!'
          });
          
        } else if (result === 'denied') {
          showToast({
            type: 'warning',
            title: 'Notifications Denied',
            message: 'Please enable notifications in your browser settings to receive quest reminders'
          });
        } else {
          showToast({
            type: 'info',
            title: 'Permission Pending',
            message: 'Please respond to the notification permission prompt'
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        showToast({
          type: 'error',
          title: 'Permission Error',
          message: 'Could not request notification permission. Please check your browser settings'
        });
      }
    } else {
      showToast({
        type: 'warning',
        title: 'Notifications Not Supported',
        message: 'Your browser does not support notifications'
      });
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => {
      const updated = prev.map(reminder => 
        reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
      );
      localStorage.setItem('notification-reminders', JSON.stringify(updated));
      return updated;
    });
  };

  // Schedule notifications based on enabled reminders
  useEffect(() => {
    const scheduleNotifications = () => {
      reminders.forEach(reminder => {
        if (reminder.enabled && permission === 'granted') {
          const [hours, minutes] = reminder.time.split(':').map(Number);
          const now = new Date();
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          // If time has passed today, schedule for tomorrow
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          
          const timeUntilNotification = scheduledTime.getTime() - now.getTime();
          
          setTimeout(() => {
            new Notification(`Solo Leveling - ${reminder.title}`, {
              body: 'Time to level up your productivity!',
              icon: '/favicon.ico',
              badge: '/favicon.ico'
            });
          }, timeUntilNotification);
        }
      });
    };

    if (permission === 'granted') {
      scheduleNotifications();
    }
  }, [reminders, permission]);

  const testNotification = () => {
    console.log('Test notification clicked, permission:', permission);
    
    if (permission === 'granted') {
      try {
        console.log('Attempting to create notification...');
        const notification = new Notification('🏹 Hunter System Alert', {
          body: 'Your daily quest briefing is ready! Time to level up your productivity!',
          icon: '/favicon.ico',
          tag: 'test-notification',
          requireInteraction: false
        });
        
        console.log('Notification created successfully:', notification);
        
        // Add event listeners for debugging
        notification.onshow = () => console.log('Notification shown');
        notification.onerror = (e) => console.error('Notification error:', e);
        notification.onclose = () => console.log('Notification closed');
        
        showToast({
          type: 'success',
          title: 'Test Notification Sent',
          message: 'Check your system notifications! Should appear in top-right corner.'
        });
      } catch (error) {
        console.error('Error creating test notification:', error);
        showToast({
          type: 'error',
          title: 'Notification Failed',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    } else if (permission === 'denied') {
      showToast({
        type: 'warning',
        title: 'Notifications Blocked',
        message: 'Please enable notifications in your browser settings first'
      });
    } else {
      showToast({
        type: 'info',
        title: 'Permission Required',
        message: 'Please enable notifications first by clicking "Enable Notifications" above'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="mystical-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white font-['Orbitron']">
              NOTIFICATION SYSTEM
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Permission Status */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Permission Status</h3>
          
          <div className={`p-4 rounded-lg border ${
            permission === 'granted' ? 'bg-green-900/20 border-green-500/30' :
            permission === 'denied' ? 'bg-red-900/20 border-red-500/30' :
            'bg-yellow-900/20 border-yellow-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold ${
                  permission === 'granted' ? 'text-green-400' :
                  permission === 'denied' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {permission === 'granted' ? '✅ Notifications Enabled' :
                   permission === 'denied' ? '❌ Notifications Blocked' :
                   '⏳ Permission Required'}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  {permission === 'granted' ? 'You will receive quest reminders and alerts' :
                   permission === 'denied' ? 'Go to browser settings > Site Settings > Notifications and allow for this site' :
                   'Click to enable browser notifications for reminders'}
                </p>
              </div>
              
              {permission !== 'granted' && (
                <button
                  onClick={requestPermission}
                  className="power-button ml-4"
                  disabled={permission === 'denied'}
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Quest Reminders</h3>
            {permission === 'granted' && (
              <button
                onClick={testNotification}
                className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
              >
                Test Notification
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {reminders.map(reminder => (
              <div 
                key={reminder.id}
                className="mystical-card p-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-white font-semibold">{reminder.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {reminder.weekly ? 'Weekly • ' : 'Daily • '}{reminder.time}
                  </p>
                </div>
                
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  disabled={permission !== 'granted'}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    reminder.enabled && permission === 'granted' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-600'
                  } ${permission !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    reminder.enabled && permission === 'granted' 
                      ? 'translate-x-6' 
                      : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
          <div className="space-y-2 text-gray-300 text-sm">
            <p>• Notifications help you stay on track with your productivity goals</p>
            <p>• Daily reminders for quest briefings and evening reviews</p>
            <p>• Weekly check-ins to assess progress and adjust goals</p>
            <p>• All reminders respect your device's Do Not Disturb settings</p>
          </div>

          {permission === 'denied' && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h4 className="text-red-400 font-semibold mb-2">How to Enable Notifications:</h4>
              <div className="text-gray-300 text-sm space-y-2">
                <p><strong>Chrome:</strong> Click the 🔒 lock icon next to the URL → Notifications → Allow</p>
                <p><strong>Firefox:</strong> Click the shield icon → Turn off blocking for Notifications</p>
                <p><strong>Safari:</strong> Safari menu → Preferences → Websites → Notifications → Allow</p>
                <p><strong>Edge:</strong> Click the 🔒 icon → Notifications → Allow</p>
                <div className="mt-3 p-2 bg-blue-900/30 rounded border border-blue-500/30">
                  <p className="text-blue-300"><strong>Mobile:</strong> Notifications work best on desktop browsers. Mobile support varies by browser.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}