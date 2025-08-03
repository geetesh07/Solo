import { cn } from "@/lib/utils";
import { Crown, Home, Calendar, BarChart3, Settings, Zap, Target, Sword } from "lucide-react";

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
  maxXP = 100, 
  rank = "E-Rank" 
}: AppSidebarProps) {
  const progressPercentage = (currentXP / maxXP) * 100;

  return (
    <aside className="w-64 h-screen overflow-y-auto glass-effect border-r border-solo-blue/20 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-b from-solo-blue/10 via-transparent to-solo-purple/10"></div>
      </div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-solo-blue to-solo-purple rounded-lg flex items-center justify-center shadow-glow animate-pulse-glow">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-xl glow-text">SOLO HUNTER</h1>
              <p className="text-xs text-gray-400 font-rajdhani">System Interface v2.1</p>
            </div>
          </div>

          {/* Player Stats Card */}
          <div className="solo-card p-5 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-solo-gold to-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-rajdhani font-semibold">LEVEL {userLevel}</p>
                  <p className="text-xs text-gray-400">Hunter</p>
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-gradient-to-r from-solo-purple to-solo-violet rounded-full text-xs font-bold">
                  {rank}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-rajdhani">
                <span className="text-gray-300">Experience</span>
                <span className="glow-text font-semibold">{currentXP.toLocaleString()} / {maxXP.toLocaleString()}</span>
              </div>
              <div className="relative">
                <div className="w-full bg-solo-darker/60 rounded-full h-3 border border-solo-blue/20">
                  <div 
                    className="bg-gradient-to-r from-solo-blue via-cyan-400 to-solo-electric h-full rounded-full transition-all duration-1000 shadow-glow relative overflow-hidden"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -right-1 -top-1">
                  <Zap className="w-3 h-3 text-solo-blue animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            <div className="text-xs font-rajdhani font-semibold text-gray-400 uppercase tracking-wider mb-4">
              HUNTER DASHBOARD
            </div>
            
            <button
              onClick={() => onViewChange('dashboard')}
              className={cn(
                "group flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 font-rajdhani font-medium",
                currentView === 'dashboard'
                  ? "bg-gradient-to-r from-solo-blue/20 to-solo-purple/20 border border-solo-blue/40 text-solo-blue shadow-glow"
                  : "hover:bg-gradient-to-r hover:from-solo-darker/60 hover:to-solo-accent/60 text-gray-300 hover:text-white border border-transparent hover:border-solo-blue/20"
              )}
            >
              <Home className={cn("w-5 h-5 transition-all", currentView === 'dashboard' ? "text-solo-blue" : "group-hover:text-solo-blue")} />
              <span className="flex-1">Mission Control</span>
              {currentView === 'dashboard' && <div className="w-2 h-2 bg-solo-blue rounded-full animate-pulse"></div>}
            </button>
            
            <button
              onClick={() => onViewChange('calendar')}
              className={cn(
                "group flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 font-rajdhani font-medium",
                currentView === 'calendar'
                  ? "bg-gradient-to-r from-solo-blue/20 to-solo-purple/20 border border-solo-blue/40 text-solo-blue shadow-glow"
                  : "hover:bg-gradient-to-r hover:from-solo-darker/60 hover:to-solo-accent/60 text-gray-300 hover:text-white border border-transparent hover:border-solo-blue/20"
              )}
            >
              <Calendar className={cn("w-5 h-5 transition-all", currentView === 'calendar' ? "text-solo-blue" : "group-hover:text-solo-blue")} />
              <span className="flex-1">Quest Timeline</span>
              {currentView === 'calendar' && <div className="w-2 h-2 bg-solo-blue rounded-full animate-pulse"></div>}
            </button>
            
            <button
              onClick={() => onViewChange('analytics')}
              className={cn(
                "group flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 font-rajdhani font-medium",
                currentView === 'analytics'
                  ? "bg-gradient-to-r from-solo-blue/20 to-solo-purple/20 border border-solo-blue/40 text-solo-blue shadow-glow"
                  : "hover:bg-gradient-to-r hover:from-solo-darker/60 hover:to-solo-accent/60 text-gray-300 hover:text-white border border-transparent hover:border-solo-blue/20"
              )}
            >
              <BarChart3 className={cn("w-5 h-5 transition-all", currentView === 'analytics' ? "text-solo-blue" : "group-hover:text-solo-blue")} />
              <span className="flex-1">Hunter Analytics</span>
              {currentView === 'analytics' && <div className="w-2 h-2 bg-solo-blue rounded-full animate-pulse"></div>}
            </button>

            <div className="border-t border-solo-blue/10 pt-4 mt-6">
              <div className="text-xs font-rajdhani font-semibold text-gray-400 uppercase tracking-wider mb-4">
                SYSTEM
              </div>
              
              <button 
                onClick={() => onViewChange('settings')}
                className={cn(
                  "group flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 font-rajdhani font-medium",
                  currentView === 'settings'
                    ? "bg-gradient-to-r from-solo-blue/20 to-solo-purple/20 border border-solo-blue/40 text-solo-blue shadow-glow"
                    : "hover:bg-gradient-to-r hover:from-solo-darker/60 hover:to-solo-accent/60 text-gray-300 hover:text-white border border-transparent hover:border-solo-blue/20"
                )}
              >
                <Settings className={cn("w-5 h-5 transition-all", currentView === 'settings' ? "text-solo-blue" : "group-hover:text-solo-blue")} />
                <span className="flex-1">System Config</span>
                {currentView === 'settings' && <div className="w-2 h-2 bg-solo-blue rounded-full animate-pulse"></div>}
              </button>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-solo-blue/30 to-transparent mb-3"></div>
            <p className="text-xs text-gray-500 font-rajdhani">Hunter System Online</p>
            <div className="flex justify-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}