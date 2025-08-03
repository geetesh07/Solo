import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Palette, User, Shield, RefreshCw, Download, Upload, Trash2, Settings as SettingsIcon, Edit, Save, X, LogOut } from "lucide-react";
import { NotificationSystem } from "../components/features/NotificationSystem";
import { showToast } from "@/components/ui/Toast";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QuestCategory {
  id: string;
  name: string;
  icon: string;
  originalName: string;
}

export function Settings() {
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();
  const { showConfirm, confirmDialog } = useConfirmDialog();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('hunter-theme') || 'default';
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<QuestCategory[]>([
    { id: 'main-mission', name: 'Main Mission', icon: '⚔️', originalName: 'Main Mission' },
    { id: 'training', name: 'Training', icon: '🛡️', originalName: 'Training' },
    { id: 'side-quest', name: 'Side Quest', icon: '⭐', originalName: 'Side Quest' }
  ]);
  const [editForm, setEditForm] = useState({ name: '', icon: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorThemes = [
    { 
      id: 'default', 
      name: 'Hunter Blue', 
      colors: ['#0ea5e9', '#06b6d4', '#3b82f6'],
      description: 'Classic Solo Leveling theme'
    },
    { 
      id: 'shadow', 
      name: 'Shadow Monarch', 
      colors: ['#7c3aed', '#8b5cf6', '#a855f7'],
      description: 'Purple shadow energy'
    },
    { 
      id: 'flame', 
      name: 'Flame Emperor', 
      colors: ['#ef4444', '#f97316', '#fbbf24'],
      description: 'Fire and gold elements'
    },
    { 
      id: 'ice', 
      name: 'Ice Bearer', 
      colors: ['#06b6d4', '#0891b2', '#0284c7'],
      description: 'Cool ice magic theme'
    },
    { 
      id: 'nature', 
      name: 'Beast Lord', 
      colors: ['#10b981', '#059669', '#047857'],
      description: 'Nature and forest vibes'
    }
  ];

  useEffect(() => {
    // Apply saved theme on component mount (without showing toast)
    const savedTheme = localStorage.getItem('hunter-theme');
    if (savedTheme && savedTheme !== 'default') {
      applySilentTheme(savedTheme);
    }
  }, []);

  // Silent theme application (without toast) for initialization
  const applySilentTheme = (themeId: string) => {
    const theme = colorThemes.find(t => t.id === themeId);
    if (theme) {
      const root = document.documentElement;
      
      // Create dynamic CSS classes for the theme
      const existingStyle = document.getElementById('dynamic-theme');
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.id = 'dynamic-theme';
      style.textContent = `
        :root {
          --primary-color: ${theme.colors[0]};
          --secondary-color: ${theme.colors[1]};
          --accent-color: ${theme.colors[2]};
          --solo-blue: ${theme.colors[0]};
          --solo-cyan: ${theme.colors[1]};
          --solo-violet: ${theme.colors[2]};
        }
        
        .power-button {
          background: linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}) !important;
        }
        
        .power-button:hover {
          background: linear-gradient(135deg, ${theme.colors[1]}, ${theme.colors[2]}) !important;
        }
        
        .mystical-card {
          border-color: ${theme.colors[0]}33 !important;
          background: linear-gradient(135deg, ${theme.colors[0]}0a, ${theme.colors[1]}05) !important;
        }
        
        .hunter-status-window {
          border-color: ${theme.colors[0]}33 !important;
          background: linear-gradient(135deg, ${theme.colors[0]}0a, ${theme.colors[1]}05) !important;
        }
        
        .bg-gradient-to-r.from-blue-500.to-cyan-500 {
          background: linear-gradient(to right, ${theme.colors[0]}, ${theme.colors[1]}) !important;
        }
        
        .bg-gradient-to-r.from-purple-400.to-pink-400 {
          background: linear-gradient(to right, ${theme.colors[1]}, ${theme.colors[2]}) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
        }
      `;
      document.head.appendChild(style);
      
      setCurrentTheme(themeId);
      localStorage.setItem('hunter-theme', themeId);
    }
  };

  // Theme application with toast notification (for manual selection)
  const applyTheme = (themeId: string) => {
    applySilentTheme(themeId);
    
    const theme = colorThemes.find(t => t.id === themeId);
    if (theme) {
      showToast({
        type: 'success',
        title: 'Theme Applied!',
        message: `${theme.name} theme is now active`
      });
    }
  };

  const handleExportData = () => {
    // Export all user data including goals, notes, calendar events
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      userProfile: {
        displayName: user?.displayName,
        email: user?.email
      },
      settings: {
        theme: currentTheme,
        categories: categories
      },
      // Add placeholders for data that would come from APIs
      notes: [],
      calendarEvents: [],
      goals: []
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solo-leveling-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Data Exported!',
      message: 'Your hunter data has been downloaded successfully'
    });
  };

  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        // Validate import data structure
        if (!importData.version || !importData.settings) {
          throw new Error('Invalid import file format');
        }

        // Apply imported settings
        if (importData.settings.theme) {
          applyTheme(importData.settings.theme);
        }
        
        if (importData.settings.categories) {
          setCategories(importData.settings.categories);
        }

        showToast({
          type: 'success',
          title: 'Data Imported!',
          message: 'Your settings have been restored successfully'
        });

      } catch (error) {
        showToast({
          type: 'error',
          title: 'Import Failed',
          message: 'Invalid file format or corrupted data'
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleResetData = () => {
    showConfirm(
      'Reset All Data',
      'This will permanently delete all your goals, notes, calendar events, and settings. This action cannot be undone. Are you sure?',
      async () => {
        try {
          // Reset theme to default
          applyTheme('default');
          
          // Reset categories to default
          setCategories([
            { id: 'main-mission', name: 'Main Mission', icon: '⚔️', originalName: 'Main Mission' },
            { id: 'training', name: 'Training', icon: '🛡️', originalName: 'Training' },
            { id: 'side-quest', name: 'Side Quest', icon: '⭐', originalName: 'Side Quest' }
          ]);

          // Clear localStorage
          localStorage.removeItem('hunter-theme');
          localStorage.removeItem('hunter-categories');

          // Invalidate all cached data
          queryClient.clear();

          showToast({
            type: 'success',
            title: 'Data Reset Complete',
            message: 'All hunter data has been cleared. Ready for a fresh start!'
          });

        } catch (error) {
          showToast({
            type: 'error',
            title: 'Reset Failed',
            message: 'Some data could not be cleared. Please try again.'
          });
        }
      },
      'danger'
    );
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditForm({ name: category.name, icon: category.icon });
    }
  };

  const handleSaveCategory = () => {
    if (!editForm.name.trim()) {
      showToast({
        type: 'warning',
        title: 'Name Required',
        message: 'Please enter a category name'
      });
      return;
    }

    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory 
        ? { ...cat, name: editForm.name, icon: editForm.icon || cat.icon }
        : cat
    ));

    // Save to localStorage
    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory 
        ? { ...cat, name: editForm.name, icon: editForm.icon || cat.icon }
        : cat
    );
    localStorage.setItem('hunter-categories', JSON.stringify(updatedCategories));

    setEditingCategory(null);
    setEditForm({ name: '', icon: '' });

    showToast({
      type: 'success',
      title: 'Category Updated!',
      message: 'Quest category has been customized'
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', icon: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Content */}
      <div className="relative min-h-screen p-3 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-['Orbitron']">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  HUNTER PANEL
                </span>
              </h1>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">Configure your quest environment</p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Hunter Profile Card */}
              <div className="mystical-card p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      HUNTER PROFILE
                    </span>
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                    <div className="text-gray-400 text-xs sm:text-sm mb-1">Hunter Name</div>
                    <div className="text-white font-bold text-sm sm:text-base">{user?.displayName || 'Anonymous Hunter'}</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                    <div className="text-gray-400 text-xs sm:text-sm mb-1">Email</div>
                    <div className="text-white font-medium text-sm sm:text-base break-all">{user?.email}</div>
                  </div>
                </div>
              </div>
              
              {/* Theme Selection */}
              <div className="mystical-card p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      THEME SELECTION
                    </span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => applyTheme(theme.id)}
                      className={`p-3 rounded-lg transition-all duration-200 border-2 ${
                        selectedTheme === theme.id
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">{theme.icon}</div>
                        <div className="text-white text-xs sm:text-sm font-medium">{theme.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6 sm:space-y-8">

              {/* Notification Settings */}
              <div className="mystical-card p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ALERT SYSTEM
                    </span>
                  </h2>
                </div>
                
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <Bell className="w-4 h-4 mr-2 inline" />
                  Configure Alerts
                </button>
              </div>

              {/* Account Management */}
              <div className="mystical-card p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ACCOUNT CONTROL
                    </span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600/20 hover:bg-red-600/30 border-2 border-red-500/30 hover:border-red-500/50 p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                      <h3 className="text-red-400 group-hover:text-red-300 font-bold text-sm sm:text-base">Sign Out</h3>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm">Log out safely</p>
                  </button>
                  
                  <button
                    onClick={handleResetData}
                    className="bg-orange-600/20 hover:bg-orange-600/30 border-2 border-orange-500/30 hover:border-orange-500/50 p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Trash2 className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
                      <h3 className="text-orange-400 group-hover:text-orange-300 font-bold text-sm sm:text-base">Reset Data</h3>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm">Clear all progress</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Notification System Modal */}
      <NotificationSystem 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {confirmDialog}
    </div>
  );
}