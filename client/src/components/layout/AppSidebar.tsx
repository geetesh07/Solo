import { cn } from "@/lib/utils";
import { Crown, Home, Calendar, BarChart3, Settings, Star, CheckCircle, Flame, Trophy } from "lucide-react";

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
  userLevel = 23, 
  currentXP = 1847, 
  maxXP = 2500,
  rank = "Shadow Monarch" 
}: AppSidebarProps) {
  const progressPercentage = (currentXP / maxXP) * 100;

  return (
    <aside className="hidden md:block w-64 bg-solo-purple border-r border-gray-800">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-solo-blue to-solo-violet rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-xl text-solo-blue">Shadow Tracker</h1>
            <p className="text-xs text-gray-400">Hunter's Quest Log</p>
          </div>
        </div>
        
        {/* User Level Display */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-solo-blue/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Level</span>
            <span className="font-orbitron font-bold text-solo-blue">{userLevel}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">{rank}</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-solo-blue to-solo-violet h-2 rounded-full animate-glow" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => onViewChange('dashboard')}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors",
              currentView === 'dashboard'
                ? "bg-solo-indigo/20 border border-solo-indigo/30 text-solo-blue"
                : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
            )}
          >
            <Home className="w-4 h-4" />
            <span>Hunter Dashboard</span>
          </button>
          
          <button
            onClick={() => onViewChange('calendar')}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors",
              currentView === 'calendar'
                ? "bg-solo-indigo/20 border border-solo-indigo/30 text-solo-blue"
                : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>Quest Calendar</span>
          </button>
          
          <button
            onClick={() => onViewChange('analytics')}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors",
              currentView === 'analytics'
                ? "bg-solo-indigo/20 border border-solo-indigo/30 text-solo-blue"
                : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Progress Analytics</span>
          </button>
          
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
