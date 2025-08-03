import { Bell } from "lucide-react";
import { format } from "date-fns";

interface TopBarProps {
  user?: any;
  onOpenMorningModal: () => void;
}

export function TopBar({ user, onOpenMorningModal }: TopBarProps) {
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <header className="bg-solo-purple border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-800/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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
          <div className="w-8 h-8 bg-gradient-to-r from-solo-blue to-solo-violet rounded-full" />
        </div>
      </div>
    </header>
  );
}
