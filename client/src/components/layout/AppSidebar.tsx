import { Home, Calendar, BarChart3, Settings } from "lucide-react";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userLevel?: number;
  currentXP?: number;
  maxXP?: number;
  rank?: string;
}

export function AppSidebar({ 
  currentView, 
  onViewChange, 
  userLevel = 1, 
  currentXP = 0, 
  maxXP = 100 
}: AppSidebarProps) {
  const progress = Math.round((currentXP / maxXP) * 100);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold">Solo Hunter</h1>
        <p className="text-sm text-muted-foreground">Productivity System</p>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level {userLevel}</span>
            <span>{currentXP.toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {progress}% to next level
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
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
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