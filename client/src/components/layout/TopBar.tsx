import { Bell, User, LogOut, Menu } from "lucide-react";
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

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 hover:bg-accent rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h2 className="font-semibold">Solo Hunter</h2>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={onOpenMorningModal}
          className="relative p-2 hover:bg-accent rounded-md"
        >
          <Bell className="w-5 h-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <span className="hidden sm:block text-sm">{user?.displayName || 'User'}</span>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl z-50 backdrop-blur-sm">
              <div className="p-4 border-b border-gray-700">
                <p className="font-semibold text-sm text-white">{user?.displayName || 'Anonymous Hunter'}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}