import { useState } from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-8 text-center shadow-2xl shadow-cyan-400/10">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-cyan-400/30">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="font-['Orbitron'] font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            Solo Hunter
          </h1>
          <p className="text-gray-300 mb-2 font-medium">Productivity System</p>
          <p className="text-sm text-gray-400 mb-8">
            Awaken your hunter abilities and level up your daily quests
          </p>
          
          {/* Motivational Quote */}
          <div className="bg-gray-900/70 border border-cyan-400/20 rounded-lg p-4 mb-8 shadow-inner">
            <p className="text-sm text-cyan-100 italic font-medium">
              "Only I can level up." - Sung Jin-Woo
            </p>
          </div>
          
          {/* Sign In Button */}
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105"
            data-testid="button-sign-in"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Entering Hunter System...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Awaken Hunter Abilities</span>
              </div>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Authenticate with Google to access the Hunter System
          </p>
          
          {/* Decorative elements */}
          <div className="mt-6 flex justify-center space-x-2 opacity-30">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
