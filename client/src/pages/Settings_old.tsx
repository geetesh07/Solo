import { useState } from "react";
import { Save, User, Palette, Bell, Shield, Trash2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";

export function Settings() {
  const [categoryNames, setCategoryNames] = useState({
    mainMission: "Main Mission",
    training: "Training", 
    sideQuest: "Side Quest"
  });
  
  const [userSettings, setUserSettings] = useState({
    displayName: "Hunter",
    avatar: "👤",
    theme: "dark",
    notifications: true,
    autoSave: true
  });

  const { showConfirm, confirmDialog } = useConfirmDialog();

  const handleCategoryNameChange = (category: string, newName: string) => {
    setCategoryNames(prev => ({
      ...prev,
      [category]: newName
    }));
  };

  const handleUserSettingChange = (setting: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your Hunter configuration has been updated'
    });
    console.log("Settings saved:", { categoryNames, userSettings });
  };

  const resetProgress = () => {
    showConfirm(
      'Reset All Progress',
      'Are you sure you want to reset all progress? This action cannot be undone and will delete all your quests, achievements, and statistics.',
      () => {
        // Reset progress logic here
        console.log("Progress reset");
        showToast({
          type: 'success',
          title: 'Progress Reset',
          message: 'All Hunter data has been cleared. You can start fresh!'
        });
      },
      'danger'
    );
  };

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              HUNTER SETTINGS
            </span>
          </h2>
          <p className="text-gray-400 mt-1">Customize your productivity system</p>
        </div>
        <button onClick={saveSettings} className="power-button">
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Profile Settings */}
      <div className="mystical-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Orbitron']">Profile Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={userSettings.displayName}
              onChange={(e) => handleUserSettingChange('displayName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Enter your hunter name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Avatar
            </label>
            <div className="flex space-x-2">
              {['👤', '🦸', '🥷', '⚔️', '🛡️'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleUserSettingChange('avatar', emoji)}
                  className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all duration-200 ${
                    userSettings.avatar === emoji 
                      ? 'border-cyan-500 bg-cyan-500/20' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Customization */}
      <div className="mystical-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Orbitron']">Category Names</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-red-400 mb-2">
              Main Mission Category
            </label>
            <input
              type="text"
              value={categoryNames.mainMission}
              onChange={(e) => handleCategoryNameChange('mainMission', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="e.g., Work Tasks, Career Goals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              Training Category
            </label>
            <input
              type="text"
              value={categoryNames.training}
              onChange={(e) => handleCategoryNameChange('training', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Learning, Skill Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2">
              Side Quest Category
            </label>
            <input
              type="text"
              value={categoryNames.sideQuest}
              onChange={(e) => handleCategoryNameChange('sideQuest', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-500 focus:outline-none"
              placeholder="e.g., Personal Tasks, Hobbies"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="mystical-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Orbitron']">System Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Daily Briefing</h4>
              <p className="text-gray-400 text-sm">Show morning quest briefing modal</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={userSettings.notifications}
                onChange={(e) => handleUserSettingChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Auto-save Progress</h4>
              <p className="text-gray-400 text-sm">Automatically save quest completion</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={userSettings.autoSave}
                onChange={(e) => handleUserSettingChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="mystical-card p-6 border-2 border-red-500/30">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Orbitron']">Data Management</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Reset All Progress</h4>
            <p className="text-gray-400 text-sm mb-4">
              This will permanently delete all your quests, progress, and statistics. This action cannot be undone.
            </p>
            <button 
              onClick={resetProgress}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2 inline" />
              Reset Progress
            </button>
          </div>
        </div>
      </div>

      {/* Export/Import */}
      <div className="mystical-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Save className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Orbitron']">Data Export</h3>
        </div>

        <div className="space-y-4">
          <button className="mystical-card p-4 w-full text-left hover:bg-white/5 transition-colors">
            <h4 className="text-white font-semibold">Export Progress</h4>
            <p className="text-gray-400 text-sm">Download your data as JSON file</p>
          </button>
          
          <button className="mystical-card p-4 w-full text-left hover:bg-white/5 transition-colors">
            <h4 className="text-white font-semibold">Share Statistics</h4>
            <p className="text-gray-400 text-sm">Generate shareable progress report</p>
          </button>
        </div>
      </div>
      {confirmDialog}
    </div>
  );
}