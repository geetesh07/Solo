import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Settings, User, Bell, Moon, Sun } from "lucide-react";

export function SettingsView() {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const [morningTime, setMorningTime] = useState("07:00");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [displayName, setDisplayName] = useState(user?.displayName || "");

  const handleSaveProfile = async () => {
    if (profile) {
      await updateProfile({
        displayName: displayName,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-solo-blue" />
        <h2 className="font-orbitron font-bold text-2xl text-solo-blue">System Settings</h2>
      </div>
      
      {/* Profile Settings */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-5 h-5 text-solo-blue" />
          <h3 className="font-semibold text-lg">Hunter Profile</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your hunter name"
              className="bg-gray-800 border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-gray-700 border-gray-600 text-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Current Level</label>
            <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2">
              <span className="text-solo-blue font-bold">{profile?.level || 1}</span>
              <span className="text-gray-400 ml-2">({profile?.rank || 'E-Rank'})</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Total XP</label>
            <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2">
              <span className="text-green-400 font-bold">{profile?.totalXP?.toLocaleString() || 0}</span>
              <span className="text-gray-400 ml-2">XP</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSaveProfile}
          className="mt-4 bg-gradient-to-r from-solo-blue to-solo-violet"
        >
          Update Profile
        </Button>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-5 h-5 text-solo-blue" />
          <h3 className="font-semibold text-lg">Morning Quest Briefing</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Morning Notifications</p>
              <p className="text-sm text-gray-400">Get daily quest prompts to start your hunter journey</p>
            </div>
            <Switch 
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Morning Briefing Time</label>
            <Input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className="bg-gray-800 border-gray-600 w-32"
            />
            <p className="text-xs text-gray-400 mt-1">When you want to receive your daily quest prompt</p>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Moon className="w-5 h-5 text-solo-blue" />
          <h3 className="font-semibold text-lg">Appearance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-400">Embrace the shadows like a true hunter</p>
            </div>
            <Switch 
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled
            />
          </div>
          
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <strong>Solo Leveling Theme Active</strong><br />
              Your app is styled with the official Solo Leveling dark theme featuring neon blues and purples.
            </p>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Data & Privacy</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <h4 className="font-medium text-solo-blue mb-2">Firebase Integration</h4>
            <p className="text-sm text-gray-300 mb-2">
              Your data is securely stored using Firebase and syncs across all your devices.
            </p>
            <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
              <li>Goals and categories are stored in Firestore</li>
              <li>User authentication via Google</li>
              <li>Real-time sync between devices</li>
              <li>Data is private and only accessible to you</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}