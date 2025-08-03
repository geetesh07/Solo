import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Target, Calendar, BarChart3, FileText, Bell } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome, Hunter!",
      icon: "🎯",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-6">🦸‍♂️</div>
          <h3 className="text-2xl font-bold text-white font-['Orbitron'] mb-4">
            Welcome to Your Hunter System
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Transform your productivity with a Solo Leveling-inspired quest management system. 
            Complete daily goals, level up your character, and become the ultimate productivity hunter!
          </p>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mt-6">
            <p className="text-blue-400 font-semibold">🏆 Ready to begin your hunter journey?</p>
          </div>
        </div>
      )
    },
    {
      title: "Quest Categories",
      icon: "⚔️",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Target className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Organize Your Missions</h3>
          </div>
          <div className="space-y-4">
            <div className="mystical-card p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <h4 className="text-red-400 font-bold">Main Mission</h4>
                  <p className="text-gray-300 text-sm">Critical work tasks and important goals</p>
                </div>
              </div>
            </div>
            <div className="mystical-card p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-500/30">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="text-blue-400 font-bold">Training</h4>
                  <p className="text-gray-300 text-sm">Learning, skills, and personal development</p>
                </div>
              </div>
            </div>
            <div className="mystical-card p-4 bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/30">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h4 className="text-green-400 font-bold">Side Quest</h4>
                  <p className="text-gray-300 text-sm">Personal tasks and optional activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Level Up System",
      icon: "👑",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👑</span>
            </div>
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Gain Experience Points</h3>
          </div>
          <div className="space-y-4">
            <div className="mystical-card p-4">
              <div className="flex justify-between items-center">
                <span className="text-white">Complete a goal</span>
                <span className="text-cyan-400 font-bold">+25 XP</span>
              </div>
            </div>
            <div className="mystical-card p-4">
              <div className="flex justify-between items-center">
                <span className="text-white">Daily streak bonus</span>
                <span className="text-amber-400 font-bold">+50 XP</span>
              </div>
            </div>
            <div className="mystical-card p-4">
              <div className="flex justify-between items-center">
                <span className="text-white">Perfect week</span>
                <span className="text-purple-400 font-bold">+200 XP</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-400 text-sm">
              📈 Level up to unlock new ranks: E-Rank → D-Rank → C-Rank → B-Rank → A-Rank → S-Rank
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Calendar & Planning",
      icon: "📅",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Calendar className="w-16 h-16 mx-auto text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Plan Your Quests</h3>
          </div>
          <div className="space-y-4">
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">📅 Calendar View</h4>
              <p className="text-gray-300 text-sm">See all your goals organized by due date and track completion patterns</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">🌅 Morning Briefing</h4>
              <p className="text-gray-300 text-sm">Start each day with an immersive quest briefing modal</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">⏰ Due Date Tracking</h4>
              <p className="text-gray-300 text-sm">Set deadlines and never miss important goals</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Analytics & Progress",
      icon: "📊",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <BarChart3 className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Track Your Growth</h3>
          </div>
          <div className="space-y-4">
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">📈 Completion Analytics</h4>
              <p className="text-gray-300 text-sm">Visual charts showing your productivity trends and patterns</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">🎯 Goal Distribution</h4>
              <p className="text-gray-300 text-sm">See how your effort is spread across different categories</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">🔥 Streak Tracking</h4>
              <p className="text-gray-300 text-sm">Maintain daily completion streaks for bonus XP</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Hunter's Archive",
      icon: "📝",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <FileText className="w-16 h-16 mx-auto text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Document Your Journey</h3>
          </div>
          <div className="space-y-4">
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">📔 Personal Notes</h4>
              <p className="text-gray-300 text-sm">Write reflections, strategies, and insights in your Hunter's Archive</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">🏷️ Organized Tags</h4>
              <p className="text-gray-300 text-sm">Tag notes by category: Strategies, Reflections, Plans, and Ideas</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">🔍 Quick Search</h4>
              <p className="text-gray-300 text-sm">Find past notes instantly with powerful search functionality</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Notifications & Reminders",
      icon: "🔔",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Bell className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white font-['Orbitron']">Stay On Track</h3>
          </div>
          <div className="space-y-4">
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">⏰ Daily Reminders</h4>
              <p className="text-gray-300 text-sm">Get notified for morning planning and evening reviews</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">📱 Browser Notifications</h4>
              <p className="text-gray-300 text-sm">Receive alerts even when the app isn't open</p>
            </div>
            <div className="mystical-card p-4">
              <h4 className="text-white font-semibold mb-2">⚙️ Customizable Settings</h4>
              <p className="text-gray-300 text-sm">Configure notification times and frequency in Settings</p>
            </div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              💡 Tip: Enable notifications in Settings → Notification Center for the best experience
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Begin!",
      icon: "🚀",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-bold text-white font-['Orbitron'] mb-4">
            You're All Set, Hunter!
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Your productivity system is ready. Start by adding your first goals in each category, 
            set up notifications, and begin your journey to become an S-Rank productivity hunter!
          </p>
          <div className="space-y-3">
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-semibold">✅ Add your first Main Mission goal</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 font-semibold">📱 Enable notifications in Settings</p>
            </div>
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
              <p className="text-purple-400 font-semibold">🎨 Customize your theme and colors</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[9999] flex items-center justify-center p-4">
      <div className="hunter-status-window max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{currentStepData.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Orbitron']">
                HUNTER TUTORIAL
              </h2>
              <p className="text-gray-400 text-sm">
                Step {currentStep + 1} of {steps.length}: {currentStepData.title}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-cyan-400'
                    : index < currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleClose}
              className="power-button"
            >
              <span>Start Hunting!</span>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 power-button"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}