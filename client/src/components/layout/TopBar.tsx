import { Bell, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  user?: any;
  onOpenMorningModal: () => void;
  onToggleMobileSidebar?: () => void;
}

export function TopBar({ user, onOpenMorningModal, onToggleMobileSidebar }: TopBarProps) {
  const { signOut } = useAuth();

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
            {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long', 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          className="relative p-2 hover:bg-accent rounded-md"
          title="Notifications - Coming Soon"
        >
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2 p-2 rounded-md">
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
          <span className="hidden sm:block text-sm text-white">{user?.displayName || 'Hunter'}</span>
        </div>
      </div>
    </header>
  );
}