import { useState } from "react";
import { X, Sun, Target, Calendar, Trophy } from "lucide-react";

interface MorningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MorningModal({ isOpen, onClose }: MorningModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Good Morning, Hunter!",
      icon: <Sun className="w-12 h-12 text-amber-400" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-300 text-lg">
            Welcome to your Daily Planning session. This is your chance to set intentions and prepare for the day ahead.
          </p>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Purpose:</strong> Help you reflect on your goals, prioritize tasks, and start your day with focus and motivation.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Daily Intentions",
      icon: <Target className="w-12 h-12 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            What are your top 3 priorities for today?
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Priority 1: Most important task"
              className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Priority 2: Second important task"
              className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Priority 3: Third important task"
              className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      )
    },
    {
      title: "Plan Your Schedule",
      icon: <Calendar className="w-12 h-12 text-green-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            When will you work on your priorities?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Morning Focus Time</label>
              <input
                type="time"
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Afternoon Focus Time</label>
              <input
                type="time"
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>
          <textarea
            placeholder="Any specific plans or notes for today?"
            className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none h-24 resize-none"
          />
        </div>
      )
    },
    {
      title: "Ready to Conquer Today!",
      icon: <Trophy className="w-12 h-12 text-amber-400" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-300 text-lg">
            Your daily plan is set. Remember: every small step brings you closer to your goals.
          </p>
          <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-300 font-semibold">
              "The journey of a thousand miles begins with a single step."
            </p>
          </div>
          <div className="text-sm text-gray-400">
            <p>✓ Priorities set</p>
            <p>✓ Schedule planned</p>
            <p>✓ Ready to level up</p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="mystical-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            {currentStepData.icon}
            <div>
              <h2 className="text-xl font-bold text-white font-['Orbitron']">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between p-6 border-t border-gray-700">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all"
            >
              Start Your Day
            </button>
          )}
        </div>
      </div>
    </div>
  );
}