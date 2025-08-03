import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun } from "lucide-react";
import { CategoryWithGoals } from "@/types";

interface MorningModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryWithGoals[];
  onAddGoal: (goalData: any) => void;
}

const motivationalQuotes = [
  "The stronger the monster, the stronger I become. - Sung Jin-Woo",
  "I alone level up. - Sung Jin-Woo", 
  "No matter how hard you train, there's always room for improvement. - Sung Jin-Woo",
  "The shadow soldiers will always have my back. - Sung Jin-Woo",
  "Every ending is a new beginning. - Sung Jin-Woo"
];

export function MorningModal({ isOpen, onClose, categories, onAddGoal }: MorningModalProps) {
  const [goalTitle, setGoalTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [xpValue, setXpValue] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleSubmit = async () => {
    if (!goalTitle.trim() || !selectedCategory) return;

    setIsSubmitting(true);
    try {
      await onAddGoal({
        title: goalTitle,
        categoryId: selectedCategory,
        status: 'pending',
        priority: 'medium',
        xpValue: xpValue,
        isRecurring: false,
      });
      
      // Reset form
      setGoalTitle("");
      setSelectedCategory("");
      setXpValue(50);
      onClose();
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnooze = () => {
    // TODO: Implement snooze functionality (e.g., remind in 15 minutes)
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-solo-purple border border-solo-blue/50 max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-solo-blue to-solo-violet rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="font-orbitron font-bold text-xl text-solo-blue">
            Morning Quest Briefing
          </DialogTitle>
          <p className="text-gray-300">What goals do you want to crush today, hunter?</p>
        </DialogHeader>
        
        {/* Motivational Quote */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 italic text-center">
            "{randomQuote}"
          </p>
        </div>
        
        {/* Quick Goal Entry */}
        <div className="space-y-4 mb-6">
          <Input
            type="text"
            placeholder="Enter today's main quest..."
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-solo-blue focus:ring-solo-blue"
          />
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 bg-gray-800 border-gray-600 text-white focus:border-solo-blue">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="XP"
              value={xpValue}
              onChange={(e) => setXpValue(Number(e.target.value))}
              className="w-20 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-solo-blue"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleSnooze}
            variant="secondary"
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            Snooze
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !goalTitle.trim() || !selectedCategory}
            className="flex-1 bg-gradient-to-r from-solo-blue to-solo-violet hover:shadow-lg hover:shadow-solo-blue/25"
          >
            {isSubmitting ? 'Adding...' : 'Begin Hunt'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
