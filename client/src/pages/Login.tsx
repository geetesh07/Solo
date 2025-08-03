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
    <div className="min-h-screen bg-solo-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-solo-purple border border-solo-blue/50 rounded-xl p-8 text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-solo-blue to-solo-violet rounded-full mx-auto mb-6 flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="font-orbitron font-bold text-3xl text-solo-blue mb-2">Shadow Tracker</h1>
          <p className="text-gray-300 mb-2">Hunter's Quest Log</p>
          <p className="text-sm text-gray-400 mb-8">Level up your productivity with the power of Solo Leveling</p>
          
          {/* Motivational Quote */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-300 italic">
              "I alone level up." - Sung Jin-Woo
            </p>
          </div>
          
          {/* Sign In Button */}
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-solo-blue to-solo-violet hover:shadow-lg hover:shadow-solo-blue/25 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Entering the System...</span>
              </div>
            ) : (
              'Begin Your Hunter Journey'
            )}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Sign in with Google to start tracking your quests
          </p>
        </div>
      </div>
    </div>
  );
}
