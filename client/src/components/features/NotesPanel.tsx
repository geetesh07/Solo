import { useState } from "react";
import * as React from "react";
import { Search, Plus, Tag, Calendar, Edit3, Trash2, Filter, Star } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: 'strategy' | 'reflection' | 'plan' | 'idea';
  starred: boolean;
}

export function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('hunter-notes');
    return saved ? JSON.parse(saved).map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    })) : [];
  });

  // Save notes to localStorage whenever notes change
  React.useEffect(() => {
    localStorage.setItem('hunter-notes', JSON.stringify(notes));
  }, [notes]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'plan' as Note['category'],
    tags: [] as string[]
  });

  const categories = [
    { id: 'all', name: 'All Notes', icon: '📋', color: 'text-gray-400' },
    { id: 'strategy', name: 'Strategies', icon: '🎯', color: 'text-blue-400' },
    { id: 'reflection', name: 'Reflections', icon: '🔍', color: 'text-purple-400' },
    { id: 'plan', name: 'Plans', icon: '📝', color: 'text-green-400' },
    { id: 'idea', name: 'Ideas', icon: '💡', color: 'text-amber-400' }
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
      alert('Please enter a title for your note');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', category: 'plan', tags: [] });
    setIsCreating(false);
    alert(`Note "${note.title}" created successfully!`);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleToggleStar = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ));
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !newNote.tags.includes(tag.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="hunter-status-window p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-white font-['Orbitron'] mb-2">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                HUNTER'S ARCHIVE
              </span>
            </h2>
            <p className="text-gray-400">Document your productivity journey</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                    : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="mystical-card p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{notes.length}</div>
            <div className="text-gray-400 text-sm">Total Notes</div>
          </div>
          <div className="mystical-card p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{notes.filter(n => n.starred).length}</div>
            <div className="text-gray-400 text-sm">Starred</div>
          </div>
          <div className="mystical-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Array.from(new Set(notes.flatMap(n => n.tags))).length}
            </div>
            <div className="text-gray-400 text-sm">Tags</div>
          </div>
          <div className="mystical-card p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {notes.filter(n => n.createdAt > new Date(Date.now() - 7*24*60*60*1000)).length}
            </div>
            <div className="text-gray-400 text-sm">This Week</div>
          </div>
        </div>
      </div>

      {/* Create New Note Modal */}
      {isCreating && (
        <div className="hunter-status-window p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white font-['Orbitron']">New Archive Entry</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={newNote.category}
                onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value as Note['category'] }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                {categories.slice(1).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your thoughts, strategies, or reflections..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                      className="ml-2 text-blue-300 hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (press Enter)..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCreateNote}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Save Entry
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="hunter-status-window p-8 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Notes Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start documenting your productivity journey by creating your first note'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Note
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="mystical-card p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{note.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      categories.find(c => c.id === note.category)?.color || 'text-gray-400'
                    } bg-gray-800`}>
                      {categories.find(c => c.id === note.category)?.icon} {note.category}
                    </span>
                    {note.starred && <Star className="w-4 h-4 text-amber-400 fill-current" />}
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">{note.content}</p>
                  
                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {note.createdAt.toLocaleDateString()}
                    {note.updatedAt > note.createdAt && (
                      <span className="ml-2">• Updated {note.updatedAt.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleStar(note.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      note.starred ? 'text-amber-400 hover:text-amber-300' : 'text-gray-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${note.starred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setEditingNote(note.id)}
                    className="p-2 text-gray-400 hover:text-cyan-400 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}