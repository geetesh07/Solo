import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Plus, Trash2, Check, X } from 'lucide-react';
import { showToast } from '@/components/ui/toast';

interface ReminderTime {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export function PhoneNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminderTimes, setReminderTimes] = useState<ReminderTime[]>(() => {
    const saved = localStorage.getItem('hunter-reminder-times');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '09:00', label: 'Morning Quest Check', enabled: true },
      { id: '2', time: '13:00', label: 'Afternoon Reminder', enabled: true },
      { id: '3', time: '18:00', label: 'Evening Review', enabled: true }
    ];
  });
  const [newTime, setNewTime] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    setupNotificationScheduler();
  }, []);

  useEffect(() => {
    localStorage.setItem('hunter-reminder-times', JSON.stringify(reminderTimes));
    setupNotificationScheduler();
  }, [reminderTimes]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      showToast({ title: 'Notifications not supported on this device', type: 'error' });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        showToast({ title: 'Notifications enabled successfully!', type: 'success' });
        setupNotificationScheduler();
      } else {
        showToast({ title: 'Notification permission denied', type: 'error' });
      }
    } catch (error) {
      showToast({ title: 'Failed to request notification permission', type: 'error' });
    }
  };

  const setupNotificationScheduler = () => {
    if (typeof window === 'undefined' || permission !== 'granted') return;

    try {
      // Clear existing intervals
      const intervals = (window as any).hunterIntervals || [];
      intervals.forEach((id: number) => {
        if (typeof id === 'number') {
          clearTimeout(id);
        }
      });
      (window as any).hunterIntervals = [];

      // Set up new intervals for each enabled reminder
      reminderTimes.forEach(reminder => {
        if (!reminder?.enabled || !reminder?.time || !reminder?.label) return;

        try {
          const [hours, minutes] = reminder.time.split(':').map(Number);
          
          if (isNaN(hours) || isNaN(minutes)) {
            console.warn('Invalid time format:', reminder.time);
            return;
          }
          
          const scheduleNotification = () => {
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            // If the time has passed today, schedule for tomorrow
            if (scheduledTime <= now) {
              scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            const timeUntilNotification = scheduledTime.getTime() - now.getTime();

            const timeoutId = setTimeout(() => {
              showNotification(reminder.label);
              // Schedule next day
              scheduleNotification();
            }, timeUntilNotification);

            if (typeof window !== 'undefined') {
              (window as any).hunterIntervals = (window as any).hunterIntervals || [];
              (window as any).hunterIntervals.push(timeoutId);
            }
          };

          scheduleNotification();
        } catch (error) {
          console.error('Error setting up notification for reminder:', reminder, error);
        }
      });
    } catch (error) {
      console.error('Error in setupNotificationScheduler:', error);
    }
  };

  const showNotification = (message: string) => {
    if (typeof window === 'undefined' || permission !== 'granted' || !message) return;

    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎯 Solo Hunter', {
          body: message,
          icon: '/icon-192x192.png',
          tag: 'hunter-reminder',
          requireInteraction: false
        });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  const addReminderTime = () => {
    if (!newTime || !newLabel.trim()) {
      showToast({ 
        title: 'Missing Information', 
        message: 'Please enter both time and label for the reminder',
        type: 'warning' 
      });
      return;
    }

    try {
      // Validate time format
      const [hours, minutes] = newTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        showToast({ 
          title: 'Invalid Time', 
          message: 'Please enter a valid time in HH:MM format',
          type: 'error' 
        });
        return;
      }

      const newReminder: ReminderTime = {
        id: Date.now().toString(),
        time: newTime,
        label: newLabel.trim(),
        enabled: true
      };

      console.log('Adding new reminder:', newReminder);
      setReminderTimes(prev => [...prev, newReminder]);
      setNewTime('');
      setNewLabel('');
      setIsAddingNew(false);
      
      showToast({ 
        title: 'Reminder Added!', 
        message: `"${newReminder.label}" scheduled for ${newReminder.time}`,
        type: 'success' 
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      showToast({ 
        title: 'Failed to Add Reminder', 
        message: 'Please try again',
        type: 'error' 
      });
    }
  };

  const toggleReminder = (id: string) => {
    setReminderTimes(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminderTimes(prev => prev.filter(reminder => reminder.id !== id));
    showToast({ title: 'Reminder deleted', type: 'success' });
  };

  const testNotification = async () => {
    console.log('Test notification clicked, permission:', permission);
    
    if (!('Notification' in window)) {
      showToast({ 
        title: 'Not Supported', 
        message: 'Notifications are not supported on this device',
        type: 'error' 
      });
      return;
    }

    if (permission !== 'granted') {
      showToast({ 
        title: 'Permission Required', 
        message: 'Please enable notifications first',
        type: 'warning' 
      });
      return;
    }

    try {
      // Show browser notification
      const notification = new Notification('🎯 Solo Hunter - Test Alert', {
        body: 'Notification system is working perfectly! You will receive reminders at your scheduled times.',
        icon: '/icon-192x192.png',
        tag: 'hunter-test',
        requireInteraction: false,
        silent: false
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      showToast({ 
        title: 'Test Notification Sent!', 
        message: 'Check your browser or device notifications',
        type: 'success' 
      });
      
      console.log('Test notification sent successfully');
    } catch (error) {
      console.error('Notification error:', error);
      showToast({ 
        title: 'Notification Failed', 
        message: `Error: ${error}`,
        type: 'error' 
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="flex items-center space-x-3">
          {permission === 'granted' ? (
            <Bell className="w-5 h-5 text-green-400" />
          ) : (
            <BellOff className="w-5 h-5 text-red-400" />
          )}
          <div>
            <div className="text-white font-medium text-sm">Notification Status</div>
            <div className={`text-xs ${
              permission === 'granted' ? 'text-green-400' : 'text-red-400'
            }`}>
              {permission === 'granted' ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
        {permission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs rounded-lg transition-colors"
            data-testid="button-enable-notifications"
          >
            Enable
          </button>
        )}
      </div>

      {/* Test Notification */}
      {permission === 'granted' && (
        <button
          onClick={testNotification}
          className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm rounded-lg transition-colors"
          data-testid="button-test-notification"
        >
          Send Test Notification
        </button>
      )}

      {/* Reminder Times */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm">Scheduled Reminders</h3>
          <button
            onClick={() => setIsAddingNew(true)}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            data-testid="button-add-reminder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add New Reminder */}
        {isAddingNew && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-cyan-500/30">
            <h4 className="text-white font-medium mb-3">Add New Reminder</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => {
                    console.log('Time input changed:', e.target.value);
                    setNewTime(e.target.value);
                  }}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  data-testid="input-reminder-time"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => {
                    console.log('Label input changed:', e.target.value);
                    setNewLabel(e.target.value);
                  }}
                  placeholder="e.g., Morning Quest Check"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-gray-400"
                  data-testid="input-reminder-label"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    console.log('Save reminder clicked with:', { newTime, newLabel });
                    addReminderTime();
                  }}
                  disabled={!newTime || !newLabel.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    newTime && newLabel.trim()
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  data-testid="button-save-reminder"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Save Reminder
                </button>
                <button
                  onClick={() => {
                    console.log('Cancel reminder clicked');
                    setIsAddingNew(false);
                    setNewTime('');
                    setNewLabel('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                  data-testid="button-cancel-reminder"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                data-testid="button-save-reminder"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewTime('');
                  setNewLabel('');
                }}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
                data-testid="button-cancel-reminder"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Existing Reminders */}
        <div className="space-y-2">
          {reminderTimes.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
              data-testid={`reminder-${reminder.id}`}
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-white text-sm font-medium">{reminder.time}</div>
                  <div className="text-gray-400 text-xs">{reminder.label}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    reminder.enabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                  data-testid={`toggle-reminder-${reminder.id}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    reminder.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  data-testid={`delete-reminder-${reminder.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {reminderTimes.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No reminders set. Click + to add your first reminder.
          </div>
        )}
      </div>

      {/* Mobile Tips */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h3 className="text-blue-300 text-sm font-medium mb-2">Tips:</h3>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>• Notifications work even when the app is closed</li>
          <li>• Enable notifications in your browser settings</li>
          <li>• Install as PWA for best mobile experience</li>
          <li>• Reminders will repeat daily at set times</li>
        </ul>
      </div>
    </div>
  );
}