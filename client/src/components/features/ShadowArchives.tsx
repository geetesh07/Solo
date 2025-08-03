import { useState, useRef } from "react";
import * as React from "react";
import { 
  Search, 
  Plus, 
  Star, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Filter,
  BookOpen,
  Calendar,
  Tag,
  ChevronDown,
  FileText
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  category: 'strategy' | 'reflection' | 'plan' | 'idea';
  starred: boolean;
}

export function ShadowArchives() {
  const queryClient = useQueryClient();
  const { showConfirm, confirmDialog } = useConfirmDialog();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'plan' as Note['category'],
    tags: [] as string[]
  });

  const [editData, setEditData] = useState({
    title: '',
    content: ''
  });

  // Fetch notes from database
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['/api/notes'],
    queryFn: async () => {
      const response = await fetch('/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      return response.json();
    }
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: any) => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
      if (!response.ok) throw new Error('Failed to create note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    }
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    }
  });

  const categories = [
    { id: 'all', name: 'All Archives', icon: FileText, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
    { id: 'strategy', name: 'Battle Strategies', icon: BookOpen, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'reflection', name: 'Hunter Reflections', icon: Star, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { id: 'plan', name: 'Quest Plans', icon: Calendar, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { id: 'idea', name: 'Shadow Ideas', icon: Plus, color: 'text-amber-400', bgColor: 'bg-amber-500/20' }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNote = () => {
    if (!newNote.title.trim()) {
      showToast({
        type: 'warning',
        title: 'Title Required',
        message: 'Please enter a title for your archive entry'
      });
      return;
    }

    createNoteMutation.mutate({
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags,
      starred: false
    }, {
      onSuccess: (note) => {
        setNewNote({ title: '', content: '', category: 'plan', tags: [] });
        setIsCreating(false);
        
        showToast({
          type: 'success',
          title: 'Archive Entry Created!',
          message: `"${note.title}" has been added to your Shadow Archives`
        });
      },
      onError: () => {
        showToast({
          type: 'error',
          title: 'Failed to Create Entry',
          message: 'Please try again'
        });
      }
    });
  };

  const handleStartEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditData({
      title: note.title,
      content: note.content
    });
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editData.title.trim()) {
      showToast({
        type: 'warning',
        title: 'Title Required',
        message: 'Please enter a title for your archive entry'
      });
      return;
    }

    updateNoteMutation.mutate({
      id: noteId,
      data: editData
    }, {
      onSuccess: () => {
        setEditingNote(null);
        setEditData({ title: '', content: '' });
        
        showToast({
          type: 'success',
          title: 'Entry Updated!',
          message: 'Your archive entry has been saved'
        });
      },
      onError: () => {
        showToast({
          type: 'error',
          title: 'Failed to Update Entry',
          message: 'Please try again'
        });
      }
    });
  };

  const handleDeleteNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    showConfirm(
      'Delete Archive Entry',
      `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
      () => {
        deleteNoteMutation.mutate(noteId, {
          onSuccess: () => {
            showToast({
              type: 'success',
              title: 'Entry Deleted',
              message: `"${note.title}" has been removed from your archives`
            });
          },
          onError: () => {
            showToast({
              type: 'error',
              title: 'Failed to Delete Entry',
              message: 'Please try again'
            });
          }
        });
      },
      'danger'
    );
  };

  const handleToggleStar = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    updateNoteMutation.mutate({
      id: noteId,
      data: { starred: !note.starred }
    }, {
      onSuccess: () => {
        showToast({
          type: 'success',
          title: !note.starred ? 'Entry Starred!' : 'Star Removed',
          message: `"${note.title}" ${!note.starred ? 'added to' : 'removed from'} starred entries`
        });
      },
      onError: () => {
        showToast({
          type: 'error',
          title: 'Failed to Update Entry',
          message: 'Please try again'
        });
      }
    });
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !newNote.tags.includes(newTagInput.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, newTagInput.trim()]
      }));
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0];

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-300">Loading Shadow Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white font-['Orbitron']">
                SHADOW ARCHIVES
              </h1>
              <p className="text-gray-300 text-sm">Preserve your Hunter's knowledge</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="power-button flex items-center space-x-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            <span>New Entry</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your archives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors min-w-[180px] justify-between"
            >
              <div className="flex items-center space-x-2">
                <selectedCategoryData.icon className={`w-5 h-5 ${selectedCategoryData.color}`} />
                <span className="truncate">{selectedCategoryData.name}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {filterDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setFilterDropdownOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                        selectedCategory === category.id ? category.bgColor : ''
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <span className="text-white">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {filteredNotes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Archives Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start documenting your Hunter journey'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="power-button"
                >
                  Create Your First Entry
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredNotes.map((note) => {
                const categoryData = categories.find(cat => cat.id === note.category) || categories[1];
                const Icon = categoryData.icon;
                const isEditing = editingNote === note.id;

                return (
                  <div key={note.id} className="mystical-card p-4 md:p-6 hover:shadow-xl transition-all duration-300">
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Entry title..."
                        />
                        <textarea
                          value={editData.content}
                          onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          rows={6}
                          placeholder="Write your thoughts..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                            disabled={updateNoteMutation.isPending}
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingNote(null);
                              setEditData({ title: '', content: '' });
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className={`p-1.5 rounded-lg ${categoryData.bgColor}`}>
                              <Icon className={`w-4 h-4 ${categoryData.color}`} />
                            </div>
                            <h3 className="font-bold text-white text-lg truncate">{note.title}</h3>
                          </div>
                          <button
                            onClick={() => handleToggleStar(note.id)}
                            className={`p-1 rounded transition-colors ${
                              note.starred 
                                ? 'text-yellow-400 hover:text-yellow-300' 
                                : 'text-gray-500 hover:text-yellow-400'
                            }`}
                          >
                            <Star className={`w-5 h-5 ${note.starred ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                          {note.content || 'No content yet...'}
                        </p>

                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {note.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                          <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                          {note.updatedAt !== note.createdAt && (
                            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartEdit(note)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create New Entry Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mystical-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-['Orbitron']">
                  NEW ARCHIVE ENTRY
                </h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({ title: '', content: '', category: 'plan', tags: [] });
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter entry title..."
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(1).map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setNewNote(prev => ({ ...prev, category: category.id as Note['category'] }))}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          newNote.category === category.id
                            ? `${category.bgColor} border-current ${category.color}`
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={8}
                  placeholder="Write your thoughts, strategies, or plans..."
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-300 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCreateNote}
                  disabled={createNoteMutation.isPending}
                  className="flex-1 power-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createNoteMutation.isPending ? 'Creating...' : 'Create Entry'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({ title: '', content: '', category: 'plan', tags: [] });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDialog}
    </div>
  );
}