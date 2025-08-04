import { useState, useEffect } from 'react';
import { Edit, Save, X, Plus } from 'lucide-react';

interface QuestCategory {
  id: string;
  name: string;
  icon: string;
  originalName: string;
}

interface ShadowArchiveCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export function CategoryCustomization() {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingArchiveCategory, setEditingArchiveCategory] = useState<string | null>(null);
  
  const [questCategories, setQuestCategories] = useState<QuestCategory[]>(() => {
    const saved = localStorage.getItem('hunter-quest-categories');
    return saved ? JSON.parse(saved) : [
      { id: 'main-mission', name: 'Main Mission', icon: '⚔️', originalName: 'Main Mission' },
      { id: 'training', name: 'Training', icon: '🛡️', originalName: 'Training' },
      { id: 'side-quest', name: 'Side Quest', icon: '⭐', originalName: 'Side Quest' }
    ];
  });

  const [archiveCategories, setArchiveCategories] = useState<ShadowArchiveCategory[]>(() => {
    const saved = localStorage.getItem('hunter-archive-categories');
    return saved ? JSON.parse(saved) : [
      { id: 'strategy', name: 'Battle Strategies', icon: '⚡', description: 'Combat tactics and planning' },
      { id: 'reflection', name: 'Hunter Reflections', icon: '🧠', description: 'Personal thoughts and insights' },
      { id: 'plan', name: 'Quest Plans', icon: '📋', description: 'Mission planning and preparation' },
      { id: 'idea', name: 'Shadow Ideas', icon: '💡', description: 'Creative thoughts and concepts' }
    ];
  });

  const [editForm, setEditForm] = useState({ name: '', icon: '' });
  const [archiveEditForm, setArchiveEditForm] = useState({ name: '', icon: '', description: '' });

  // Save to localStorage when categories change
  useEffect(() => {
    localStorage.setItem('hunter-quest-categories', JSON.stringify(questCategories));
  }, [questCategories]);

  useEffect(() => {
    localStorage.setItem('hunter-archive-categories', JSON.stringify(archiveCategories));
  }, [archiveCategories]);

  const handleEditQuestCategory = (categoryId: string) => {
    const category = questCategories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditForm({ name: category.name, icon: category.icon });
    }
  };

  const handleSaveQuestCategory = () => {
    if (!editForm.name.trim()) return;

    setQuestCategories(prev => prev.map(cat => 
      cat.id === editingCategory 
        ? { ...cat, name: editForm.name, icon: editForm.icon || cat.icon }
        : cat
    ));

    setEditingCategory(null);
    setEditForm({ name: '', icon: '' });
  };

  const handleEditArchiveCategory = (categoryId: string) => {
    const category = archiveCategories.find(c => c.id === categoryId);
    if (category) {
      setEditingArchiveCategory(categoryId);
      setArchiveEditForm({ name: category.name, icon: category.icon, description: category.description });
    }
  };

  const handleSaveArchiveCategory = () => {
    if (!archiveEditForm.name.trim()) return;

    setArchiveCategories(prev => prev.map(cat => 
      cat.id === editingArchiveCategory 
        ? { ...cat, name: archiveEditForm.name, icon: archiveEditForm.icon || cat.icon, description: archiveEditForm.description }
        : cat
    ));

    setEditingArchiveCategory(null);
    setArchiveEditForm({ name: '', icon: '', description: '' });
  };

  const resetToDefaults = () => {
    const defaultQuest = [
      { id: 'main-mission', name: 'Main Mission', icon: '⚔️', originalName: 'Main Mission' },
      { id: 'training', name: 'Training', icon: '🛡️', originalName: 'Training' },
      { id: 'side-quest', name: 'Side Quest', icon: '⭐', originalName: 'Side Quest' }
    ];
    
    const defaultArchive = [
      { id: 'strategy', name: 'Battle Strategies', icon: '⚡', description: 'Combat tactics and planning' },
      { id: 'reflection', name: 'Hunter Reflections', icon: '🧠', description: 'Personal thoughts and insights' },
      { id: 'plan', name: 'Quest Plans', icon: '📋', description: 'Mission planning and preparation' },
      { id: 'idea', name: 'Shadow Ideas', icon: '💡', description: 'Creative thoughts and concepts' }
    ];

    setQuestCategories(defaultQuest);
    setArchiveCategories(defaultArchive);
  };

  return (
    <div className="space-y-6">
      {/* Quest Categories */}
      <div className="mystical-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                QUEST CATEGORIES
              </span>
            </h2>
          </div>
          <button
            onClick={resetToDefaults}
            className="text-xs px-3 py-1 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 rounded transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
        
        <div className="space-y-3">
          {questCategories.map((category) => (
            <div key={category.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              {editingCategory === category.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Category name"
                      data-testid={`input-quest-category-name-${category.id}`}
                    />
                    <input
                      type="text"
                      value={editForm.icon}
                      onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Icon (emoji)"
                      data-testid={`input-quest-category-icon-${category.id}`}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveQuestCategory}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      data-testid={`button-save-quest-category-${category.id}`}
                    >
                      <Save className="w-4 h-4 mr-1 inline" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      data-testid={`button-cancel-quest-category-${category.id}`}
                    >
                      <X className="w-4 h-4 mr-1 inline" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <div className="text-white font-medium text-sm sm:text-base">{category.name}</div>
                      <div className="text-gray-400 text-xs capitalize">{category.id.replace('-', ' ')}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditQuestCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                    data-testid={`button-edit-quest-category-${category.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shadow Archive Categories */}
      <div className="mystical-card p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SHADOW ARCHIVE CATEGORIES
            </span>
          </h2>
        </div>
        
        <div className="space-y-3">
          {archiveCategories.map((category) => (
            <div key={category.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              {editingArchiveCategory === category.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={archiveEditForm.name}
                      onChange={(e) => setArchiveEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Category name"
                      data-testid={`input-archive-category-name-${category.id}`}
                    />
                    <input
                      type="text"
                      value={archiveEditForm.icon}
                      onChange={(e) => setArchiveEditForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Icon (emoji)"
                      data-testid={`input-archive-category-icon-${category.id}`}
                    />
                  </div>
                  <input
                    type="text"
                    value={archiveEditForm.description}
                    onChange={(e) => setArchiveEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    placeholder="Description"
                    data-testid={`input-archive-category-desc-${category.id}`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveArchiveCategory}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      data-testid={`button-save-archive-category-${category.id}`}
                    >
                      <Save className="w-4 h-4 mr-1 inline" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingArchiveCategory(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      data-testid={`button-cancel-archive-category-${category.id}`}
                    >
                      <X className="w-4 h-4 mr-1 inline" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <div className="text-white font-medium text-sm sm:text-base">{category.name}</div>
                      <div className="text-gray-400 text-xs">{category.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditArchiveCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                    data-testid={`button-edit-archive-category-${category.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}