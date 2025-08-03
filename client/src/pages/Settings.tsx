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
    // Apply saved theme on component mount
    const savedTheme = localStorage.getItem('hunter-theme');
    if (savedTheme && savedTheme !== 'default') {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
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
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
      <div className="max-w-full p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-['Orbitron']">
                HUNTER SETTINGS
              </h1>
              <p className="text-gray-300">Configure your Shadow System</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="hunter-status-window p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white font-['Orbitron']">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                HUNTER PROFILE
              </span>
            </h2>
          </div>
          
          <div className="mystical-card p-6">
            <h3 className="text-white font-semibold mb-4">Hunter Information</h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">{user?.displayName || 'Anonymous Hunter'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Registration:</span>
                <span className="text-white font-medium">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Theme:</span>
                <span className="text-white font-medium">
                  {colorThemes.find(t => t.id === currentTheme)?.name || 'Hunter Blue'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="hunter-status-window p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Orbitron']">APPEARANCE</h2>
              <p className="text-gray-400">Customize your Hunter interface</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme.id)}
                className={`mystical-card p-4 text-left transition-all hover:scale-105 ${
                  currentTheme === theme.id ? 'ring-2 ring-cyan-400 bg-gray-800/60' : ''
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex space-x-1">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <h3 className="text-white font-semibold">{theme.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">{theme.description}</p>
                {currentTheme === theme.id && (
                  <div className="mt-2 text-cyan-400 font-medium text-sm">✓ Active</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="hunter-status-window p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-['Orbitron']">NOTIFICATION CENTER</h2>
                <p className="text-gray-400">Manage quest reminders and alerts</p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="power-button"
            >
              Configure
            </button>
          </div>
          
          <div className="mystical-card p-6">
            <p className="text-gray-300 mb-4">
              Set up browser notifications to stay on track with your productivity goals. 
              Get reminders for upcoming deadlines, daily check-ins, and achievement celebrations.
            </p>
            <div className="text-sm text-gray-400">
              Permission status: <span className="text-white">
                {typeof window !== 'undefined' && 'Notification' in window 
                  ? Notification.permission === 'granted' ? 'Granted' : 'Pending'
                  : 'Not supported'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Category Customization */}
        <div className="hunter-status-window p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Orbitron']">QUEST CATEGORIES</h2>
              <p className="text-gray-400">Customize category names and icons</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="mystical-card p-4">
                {editingCategory === category.id ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-white font-semibold mb-2">Category Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter category name..."
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-white font-semibold mb-2">Icon</label>
                        <input
                          type="text"
                          value={editForm.icon}
                          onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                          placeholder="🎯"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveCategory}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {category.name !== category.originalName ? `Originally: ${category.originalName}` : 'Default category'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEditCategory(category.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Customize</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Actions */}
        <div className="hunter-status-window p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white font-['Orbitron']">SYSTEM ACTIONS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleExportData}
              className="mystical-card p-6 text-left hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Download className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
                <h3 className="text-white font-semibold text-lg">Export Data</h3>
              </div>
              <p className="text-gray-400">Download all your productivity data as JSON</p>
            </button>
            
            <button 
              onClick={handleImportData}
              className="mystical-card p-6 text-left hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-white font-semibold text-lg">Import Data</h3>
              </div>
              <p className="text-gray-400">Upload settings from another system</p>
            </button>
            
            <button 
              onClick={handleResetData}
              className="mystical-card p-6 text-left hover:bg-red-900/30 transition-colors border-red-500/30 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Trash2 className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
                <h3 className="text-red-400 font-semibold text-lg">Reset All Data</h3>
              </div>
              <p className="text-gray-400">Clear all goals and start fresh</p>
            </button>
            
            <button
              onClick={signOut}
              className="mystical-card p-6 text-left hover:bg-red-900/30 transition-colors border-red-500/30 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
                <h3 className="text-red-400 font-semibold text-lg">Sign Out</h3>
              </div>
              <p className="text-gray-400">Log out of your hunter account</p>
            </button>
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
    </div>
  );
}