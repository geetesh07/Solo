import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Palette, User, Shield, RefreshCw } from "lucide-react";
import { NotificationSystem } from "../components/features/NotificationSystem";

export function Settings() {
  const { signOut, user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  const colorThemes = [
    { 
      id: 'default', 
      name: 'Hunter Blue', 
      colors: ['#0ea5e9', '#06b6d4', '#3b82f6'],
      description: 'Classic Solo Leveling theme'
    },
    { 
      id: 'shadow', 
      name: 'Shadow Monarch', 
      colors: ['#7c3aed', '#8b5cf6', '#a855f7'],
      description: 'Purple shadow energy'
    },
    { 
      id: 'flame', 
      name: 'Flame Emperor', 
      colors: ['#ef4444', '#f97316', '#fbbf24'],
      description: 'Fire and gold elements'
    },
    { 
      id: 'ice', 
      name: 'Ice Bearer', 
      colors: ['#06b6d4', '#0891b2', '#0284c7'],
      description: 'Cool ice magic theme'
    },
    { 
      id: 'nature', 
      name: 'Beast Lord', 
      colors: ['#10b981', '#059669', '#047857'],
      description: 'Nature and forest vibes'
    }
  ];

  const applyTheme = (themeId: string) => {
    const theme = colorThemes.find(t => t.id === themeId);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--neon-blue', theme.colors[0]);
      root.style.setProperty('--neon-cyan', theme.colors[1]);
      root.style.setProperty('--neon-purple', theme.colors[2]);
      setCurrentTheme(themeId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="hunter-status-window p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              HUNTER PROFILE
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mystical-card p-4">
            <h3 className="text-white font-semibold mb-3">Hunter Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{user?.displayName || 'Anonymous Hunter'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Registration:</span>
                <span className="text-white">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mystical-card p-4">
            <h3 className="text-white font-semibold mb-3">Hunter Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Sessions:</span>
                <span className="text-cyan-400">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Goals Created:</span>
                <span className="text-cyan-400">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Completion:</span>
                <span className="text-cyan-400">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="hunter-status-window p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Orbitron']">NOTIFICATION CENTER</h2>
              <p className="text-gray-400 text-sm">Manage quest reminders and alerts</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="power-button"
          >
            Configure
          </button>
        </div>
        
        <div className="mystical-card p-4">
          <p className="text-gray-300 mb-4">
            Set up browser notifications to stay on track with your productivity goals. 
            Get reminders for daily planning sessions, goal deadlines, and weekly reviews.
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-sm">Click Configure to set up notifications</span>
          </div>
        </div>
      </div>

      {/* Theme Customization */}
      <div className="hunter-status-window p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Orbitron']">APPEARANCE CUSTOMIZATION</h2>
            <p className="text-gray-400 text-sm">Personalize your hunter interface</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorThemes.map(theme => (
            <div
              key={theme.id}
              className={`mystical-card p-4 cursor-pointer transition-all duration-200 ${
                currentTheme === theme.id 
                  ? 'ring-2 ring-cyan-400 bg-cyan-900/20' 
                  : 'hover:bg-gray-800/50'
              }`}
              onClick={() => applyTheme(theme.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <h3 className="text-white font-semibold">{theme.name}</h3>
              </div>
              <p className="text-gray-400 text-sm">{theme.description}</p>
              {currentTheme === theme.id && (
                <div className="mt-2 text-cyan-400 text-sm font-semibold">✓ Active</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Customization */}
      <div className="hunter-status-window p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Orbitron']">QUEST CATEGORIES</h2>
            <p className="text-gray-400 text-sm">Customize category names and icons</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { current: 'Main Mission', icon: '⚔️', suggestion: 'Critical Tasks' },
            { current: 'Training', icon: '🛡️', suggestion: 'Learning & Growth' },
            { current: 'Side Quest', icon: '⭐', suggestion: 'Personal Projects' }
          ].map((category, index) => (
            <div key={index} className="mystical-card p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{category.current}</h3>
                  <p className="text-gray-400 text-sm">Suggested: {category.suggestion}</p>
                </div>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                Customize
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div className="hunter-status-window p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white font-['Orbitron']">SYSTEM ACTIONS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="mystical-card p-4 text-left hover:bg-gray-800/50 transition-colors">
            <h3 className="text-white font-semibold mb-2">Reset All Data</h3>
            <p className="text-gray-400 text-sm">Clear all goals and start fresh</p>
          </button>
          
          <button className="mystical-card p-4 text-left hover:bg-gray-800/50 transition-colors">
            <h3 className="text-white font-semibold mb-2">Export Data</h3>
            <p className="text-gray-400 text-sm">Download your productivity data</p>
          </button>
          
          <button className="mystical-card p-4 text-left hover:bg-gray-800/50 transition-colors">
            <h3 className="text-white font-semibold mb-2">Import Goals</h3>
            <p className="text-gray-400 text-sm">Upload goals from another system</p>
          </button>
          
          <button
            onClick={signOut}
            className="mystical-card p-4 text-left hover:bg-red-900/30 transition-colors border-red-500/30"
          >
            <h3 className="text-red-400 font-semibold mb-2">Sign Out</h3>
            <p className="text-gray-400 text-sm">Log out of your hunter account</p>
          </button>
        </div>
      </div>

      {/* Notification System Modal */}
      <NotificationSystem 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}