import { useState, useEffect } from "react";
import { Bell, Settings, X, Check } from "lucide-react";

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSystem({ isOpen, onClose }: NotificationSystemProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Daily Quest Reminder', time: '09:00', enabled: false },
    { id: '2', title: 'Evening Review', time: '18:00', enabled: false },
    { id: '3', title: 'Weekly Goals Check', time: '10:00', enabled: false, weekly: true }
  ]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        new Notification('Solo Leveling Productivity', {
          body: 'Notifications enabled! You\'ll receive quest reminders.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('Hunter System Alert', {
        body: 'Your daily quest briefing is ready!',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
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
                   permission === 'denied' ? 'Please enable notifications in your browser settings' :
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
        </div>
      </div>
    </div>
  );
}