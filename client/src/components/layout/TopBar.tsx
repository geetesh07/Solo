import { Bell, User, LogOut, Menu } from "lucide-react";
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

  return (
    <header className="bg-solo-purple border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-orbitron font-bold text-xl">{currentDate}</h2>
            <p className="text-sm text-gray-400">Ready to level up, Hunter?</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenMorningModal}
            className="relative p-2 rounded-lg hover:bg-gray-800/50"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50"
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-solo-blue to-solo-violet rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="hidden sm:block text-sm">{user?.displayName || 'Hunter'}</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-medium">{user?.displayName || 'Anonymous Hunter'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-700 text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
