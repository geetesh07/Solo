import { Bell, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  user?: any;
  onMenuClick?: () => void;
}

export function TopBar({ user, onMenuClick }: TopBarProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        // The app will automatically redirect to login due to auth state change
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };

  return (
    <header className="h-16 border-b border-cyan-500/20 bg-gray-900/90 backdrop-blur-sm px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Mobile hamburger */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-800 rounded-md text-cyan-400"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h2 className="font-['Orbitron'] font-semibold text-cyan-400">Solo Hunter</h2>
          <p className="text-xs text-gray-400">
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
        {/* User Profile & Sign Out */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-cyan-400/30"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="hidden sm:block text-sm text-white font-medium">
              {user?.displayName || 'Hunter'}
            </span>
          </div>
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 rounded-lg text-sm font-medium transition-colors"
            data-testid="button-sign-out"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}