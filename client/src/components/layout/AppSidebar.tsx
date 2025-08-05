import { Home, Calendar, BarChart3, Settings, User, BookOpen, Flame } from "lucide-react";

interface AppSidebarProps {
  currentView: string;
  onViewChange?: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  userLevel?: number;
  currentXP?: number;
  maxXP?: number;
  rank?: string;
  user?: { displayName?: string | null; } | null;
}

export function AppSidebar({ 
  currentView, 
  onViewChange, 
  collapsed = false,
  onToggleCollapse,
  userLevel = 1, 
  currentXP = 0, 
  maxXP = 100,
  user
}: AppSidebarProps) {
  const progress = Math.round((currentXP / maxXP) * 100);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'streaks', label: 'Streak Tracker', icon: Flame },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notes', label: 'Shadow Archives', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 to-black border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/attached_assets/image_1754237156070.png" 
            alt="Solo Leveling - ARISE" 
            className="h-12 w-auto object-contain"
          />
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-32">{user?.displayName || 'Hunter'}</h1>
            <p className="text-xs text-gray-400">Level {userLevel}</p>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="p-6 border-b border-gray-700">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">XP Progress</span>
            <span className="text-cyan-400 font-semibold">{currentXP}/{maxXP}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 text-center">
            {maxXP - currentXP} XP to next level
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange?.(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}