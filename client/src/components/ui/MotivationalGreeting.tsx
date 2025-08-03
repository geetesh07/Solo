import { useState, useEffect } from "react";
import { X, RefreshCw, Star } from "lucide-react";
import { getRandomQuote, getDailyQuote, type MotivationalQuote } from "@/data/motivationalQuotes";

interface MotivationalGreetingProps {
  userName?: string;
  onClose: () => void;
}

export function MotivationalGreeting({ userName = "Hunter", onClose }: MotivationalGreetingProps) {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(() => getDailyQuote());
  const [greeting, setGreeting] = useState("");

  // Update quote daily - check if we need a new quote
  useEffect(() => {
    const checkForNewQuote = () => {
      const today = new Date().toDateString();
      const lastQuoteDate = localStorage.getItem('last-quote-date');
      
      if (lastQuoteDate !== today) {
        const newQuote = getDailyQuote();
        setCurrentQuote(newQuote);
        localStorage.setItem('last-quote-date', today);
      }
    };
    
    checkForNewQuote();
    
    // Check every hour if we need a new quote (in case user keeps app open overnight)
    const interval = setInterval(checkForNewQuote, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = "";
    
    if (hour < 12) {
      timeGreeting = "Good morning";
    } else if (hour < 17) {
      timeGreeting = "Good afternoon";
    } else {
      timeGreeting = "Good evening";
    }
    
    const greetings = [
      `${timeGreeting}, ${userName}! Ready to level up today?`,
      `${timeGreeting}, ${userName}! Time to conquer your quests!`,
      `${timeGreeting}, ${userName}! Your adventure awaits!`,
      `${timeGreeting}, ${userName}! Let's rise stronger than yesterday!`,
      `${timeGreeting}, ${userName}! Today's battles will forge your legend!`,
      `${timeGreeting}, ${userName}! The Shadow Monarch believes in you!`,
      `${timeGreeting}, ${userName}! Every quest completed makes you stronger!`,
      `${timeGreeting}, ${userName}! Time to show the world your true power!`
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  }, [userName]);

  const handleNewQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'perseverance': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'strength': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'dreams': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'courage': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'friendship': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'growth': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="mystical-card max-w-2xl w-full animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['Orbitron']">
                  HUNTER'S DAILY MOTIVATION
                </h2>
                <p className="text-gray-400 text-sm">Fuel your inner power</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Greeting */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-['Orbitron']">
              {greeting}
            </h3>
            <p className="text-gray-300">
              Another day, another chance to prove your strength and achieve greatness!
            </p>
          </div>

          {/* Quote Section */}
          <div className="mystical-card p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/40">
            <div className="flex items-center justify-between mb-4">
              <div className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${getCategoryColor(currentQuote.category)}`}>
                {currentQuote.category}
              </div>
              <button
                onClick={handleNewQuote}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                title="Get new quote"
              >
                <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            <blockquote className="text-white text-lg leading-relaxed mb-4 font-medium">
              "{currentQuote.text}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-cyan-400 font-semibold">— {currentQuote.author}</p>
                <p className="text-gray-400 text-sm">{currentQuote.anime}</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Remember: Every small step forward is progress. Every completed quest makes you stronger.
              Your journey to becoming the ultimate Hunter starts now!
            </p>
            
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={handleNewQuote}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>New Quote</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 power-button"
              >
                Start My Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}