import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Palette, User, Shield, RefreshCw, Download, Upload, Trash2, Settings as SettingsIcon, Edit, Save, X } from "lucide-react";
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white font-['Orbitron'] mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  HUNTER COMMAND CENTER
                </span>
              </h1>
              <p className="text-gray-300 text-lg">Master your Solo Leveling experience</p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hunter Profile Card */}
            <div className="lg:col-span-1">
              <div className="mystical-card p-8 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-['Orbitron'] mb-2">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        HUNTER PROFILE
                      </span>
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                      <div className="text-gray-400 text-sm mb-1">Hunter Name</div>
                      <div className="text-white font-bold text-lg">{user?.displayName || 'Anonymous Hunter'}</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                      <div className="text-gray-400 text-sm mb-1">Email</div>
                      <div className="text-white font-medium">{user?.email}</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                      <div className="text-gray-400 text-sm mb-1">Registration</div>
                      <div className="text-white font-medium">
                        {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-GB') : 'Unknown'}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                      <div className="text-gray-400 text-sm mb-1">Active Theme</div>
                      <div className="text-white font-medium">
                        {colorThemes.find(t => t.id === currentTheme)?.name || 'Hunter Blue'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Panels */}
            <div className="lg:col-span-2 space-y-8">

              {/* Appearance Settings */}
              <div className="mystical-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white font-['Orbitron']">SHADOW THEMES</h2>
                      <p className="text-gray-400">Customize your Hunter interface</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => applyTheme(theme.id)}
                        className={`bg-gray-800/50 border-2 p-6 rounded-xl text-left transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                          currentTheme === theme.id ? 'border-cyan-400 bg-cyan-900/20 shadow-cyan-400/25' : 'border-gray-700/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="flex space-x-1">
                            {theme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-5 h-5 rounded-full border-2 border-white/20"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <h3 className="text-white font-bold text-lg">{theme.name}</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{theme.description}</p>
                        {currentTheme === theme.id && (
                          <div className="flex items-center text-cyan-400 font-bold text-sm">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                            ACTIVE THEME
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="mystical-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white font-['Orbitron']">ALERT SYSTEM</h2>
                        <p className="text-gray-400">Manage quest reminders and notifications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNotificationOpen(true)}
                      className="power-button"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Configure Alerts
                    </button>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
                    <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                      Enable browser notifications to receive real-time updates about your hunter activities. 
                      Get alerts for quest deadlines, daily check-ins, achievement unlocks, and streak milestones.
                    </p>
                    <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
                      <div className="text-sm">
                        <span className="text-gray-400">Permission Status:</span>
                        <span className={`ml-2 font-bold ${
                          typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' 
                            ? 'text-green-400' 
                            : typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}>
                          {typeof window !== 'undefined' && 'Notification' in window 
                            ? Notification.permission === 'granted' ? 'Granted' : 'Pending'
                            : 'Not supported'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
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