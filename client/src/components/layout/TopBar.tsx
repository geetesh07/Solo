import { Bell, User, LogOut, Menu, Shield, Swords } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  user?: any;
  onOpenMorningModal: () => void;
  onToggleMobileSidebar?: () => void;
}

export function TopBar({ user, onOpenMorningModal, onToggleMobileSidebar }: TopBarProps) {
  const { signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");
  const currentTime = format(new Date(), "HH:mm");

  return (
    <header className="glass-effect border-b border-solo-blue/20 p-4 relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-solo-dark/50 via-solo-accent/30 to-solo-dark/50 opacity-50"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-solo-accent/50 transition-all duration-300 group"
          >
            <Menu className="w-5 h-5 text-gray-300 group-hover:text-solo-blue" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-solo-blue to-solo-purple rounded-lg flex items-center justify-center shadow-glow">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-lg glow-text">
                HUNTER SYSTEM
              </h2>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-400 font-rajdhani">{currentDate}</span>
                <div className="w-1 h-1 bg-solo-blue rounded-full"></div>
                <span className="text-solo-blue font-rajdhani font-semibold">{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quest Alert Button */}
          <button 
            onClick={onOpenMorningModal}
            className="relative group p-3 rounded-xl hover:bg-solo-accent/50 transition-all duration-300 border border-transparent hover:border-solo-blue/30"
          >
            <Bell className="w-5 h-5 text-gray-300 group-hover:text-solo-blue transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-solo-red to-red-500 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-solo-red/50 rounded-full animate-ping"></div>
            
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-solo-darker border border-solo-blue/30 rounded-lg text-xs font-rajdhani opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              Daily Quest Briefing
            </div>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-solo-accent/50 transition-all duration-300 border border-transparent hover:border-solo-blue/30 group"
            >
              {user?.photoURL ? (
                <div className="relative">
                  <img 
                    src={user.photoURL} 
                    alt="Hunter Profile" 
                    className="w-8 h-8 rounded-full border-2 border-solo-blue/30 group-hover:border-solo-blue"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-solo-dark rounded-full"></div>
                </div>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-solo-blue to-solo-violet rounded-full flex items-center justify-center border-2 border-solo-blue/30 group-hover:border-solo-blue">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-rajdhani font-semibold text-white">{user?.displayName || 'Anonymous Hunter'}</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
              <div className="w-4 h-4 border-l border-b border-gray-400 transform rotate-45 transition-transform group-hover:border-solo-blue"></div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 solo-card z-50 animate-slide-up">
                <div className="p-4 border-b border-solo-blue/20">
                  <div className="flex items-center space-x-3">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full border-2 border-solo-blue/30"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-solo-blue to-solo-violet rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-rajdhani font-semibold text-white">{user?.displayName || 'Anonymous Hunter'}</p>
                      <p className="text-xs text-gray-400 break-all">{user?.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-400 font-rajdhani">Active Hunter</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-solo-red/20 text-red-400 hover:text-red-300 transition-all duration-300 font-rajdhani font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}