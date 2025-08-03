import { useState } from "react";
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
    content: '',
    tags: [] as string[]
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
      setIsCreating(false);
      setNewNote({
        title: '',
        content: '',
        category: 'plan',
        tags: []
      });
      showToast({
        type: 'success',
        title: 'Archive Created',
        message: 'Your Hunter knowledge has been preserved!'
      });
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
      setEditingNote(null);
      showToast({
        type: 'success',
        title: 'Archive Updated',
        message: 'Your knowledge has been updated!'
      });
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
      showToast({
        type: 'success',
        title: 'Archive Deleted',
        message: 'Knowledge entry has been removed'
      });
    }
  });

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: async ({ id, starred }: { id: string; starred: boolean }) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: !starred })
      });
      if (!response.ok) throw new Error('Failed to update note');
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

  const filteredNotes = notes.filter((note: Note) => {
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
        message: 'Please enter a title for your archive'
      });
      return;
    }

    createNoteMutation.mutate({
      ...newNote,
      starred: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditData({
      title: note.title,
      content: note.content,
      tags: note.tags
    });
  };

  const handleUpdateNote = () => {
    if (!editData.title.trim()) {
      showToast({
        type: 'warning',
        title: 'Title Required',
        message: 'Please enter a title for your archive'
      });
      return;
    }

    updateNoteMutation.mutate({
      id: editingNote!,
      data: {
        ...editData,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const handleDeleteNote = (id: string) => {
    showConfirm(
      'Delete Archive',
      'Are you sure you want to delete this knowledge entry? This action cannot be undone.',
      () => deleteNoteMutation.mutate(id)
    );
  };

  const handleToggleStar = (note: Note) => {
    toggleStarMutation.mutate({ id: note.id, starred: note.starred });
  };

  const addTagToNewNote = () => {
    if (newTagInput.trim() && !newNote.tags.includes(newTagInput.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, newTagInput.trim()]
      }));
      setNewTagInput('');
    }
  };

  const removeTagFromNewNote = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTagToEditNote = () => {
    if (newTagInput.trim() && !editData.tags.includes(newTagInput.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTagInput.trim()]
      }));
      setNewTagInput('');
    }
  };

  const removeTagFromEditNote = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SHADOW ARCHIVES
              </h1>
              <p className="text-gray-400 text-sm">Preserve your Hunter's knowledge</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>NEW ENTRY</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your archives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/60 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white flex items-center space-x-2 hover:border-purple-400 transition-colors min-w-[200px] justify-between"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>{categories.find(c => c.id === selectedCategory)?.name || 'All Archives'}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {filterDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 min-w-[200px]">
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                        selectedCategory === category.id ? 'bg-gray-700' : ''
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${category.color}`} />
                      <span className="text-white">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-3">No Archives Found</h3>
            <p className="text-gray-400 mb-6">Start documenting your Hunter journey</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              CREATE YOUR FIRST ENTRY
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note: Note) => {
              const category = categories.find(c => c.id === note.category);
              const IconComponent = category?.icon || FileText;
              
              return (
                <div
                  key={note.id}
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${category?.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${category?.color}`} />
                      </div>
                      <div className="flex-1">
                        {editingNote === note.id ? (
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm font-semibold w-full"
                          />
                        ) : (
                          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {note.title}
                          </h3>
                        )}
                        <p className="text-xs text-gray-400 capitalize">{category?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleStar(note)}
                        className={`p-1 rounded transition-colors ${
                          note.starred ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${note.starred ? 'fill-current' : ''}`} />
                      </button>
                      
                      {editingNote === note.id ? (
                        <>
                          <button
                            onClick={handleUpdateNote}
                            className="p-1 rounded text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingNote(null)}
                            className="p-1 rounded text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-1 rounded text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 rounded text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {editingNote === note.id ? (
                      <textarea
                        value={editData.content}
                        onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm resize-none"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-300 text-sm line-clamp-4">
                        {note.content || 'No content yet...'}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editingNote === note.id ? (
                      <div className="w-full">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {editData.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                              <button
                                onClick={() => removeTagFromEditNote(tag)}
                                className="ml-1 text-purple-400 hover:text-red-400"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add tag..."
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTagToEditNote()}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                          />
                          <button
                            onClick={addTagToEditNote}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      note.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span>Created: {formatDate(note.createdAt)}</span>
                      <span>Updated: {formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-['Orbitron']">Create New Archive</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter archive title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value as Note['category'] }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none cursor-pointer"
                >
                  <option value="strategy">Battle Strategies</option>
                  <option value="reflection">Hunter Reflections</option>
                  <option value="plan">Quest Plans</option>
                  <option value="idea">Shadow Ideas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Content</label>
                <textarea
                  placeholder="Document your Hunter knowledge..."
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none resize-none"
                  rows={6}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newNote.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-purple-500/20 text-purple-300 text-sm px-3 py-1 rounded-full"
                    >
                      <Tag className="w-4 h-4 mr-1" />
                      {tag}
                      <button
                        onClick={() => removeTagFromNewNote(tag)}
                        className="ml-2 text-purple-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTagToNewNote()}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    onClick={addTagToNewNote}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateNote}
                disabled={createNoteMutation.isPending}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                {createNoteMutation.isPending ? 'Creating...' : 'Create Archive'}
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog}
    </div>
  );
}