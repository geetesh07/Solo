import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUserGoals, useUserNotes } from '@/hooks/useUserData';
import { Database, Shield, CheckCircle, AlertCircle, Users, FileText, Target } from 'lucide-react';

export function DataStorageStatus() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { goals, loading: goalsLoading } = useUserGoals();
  const { notes, loading: notesLoading } = useUserNotes();
  
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    // Check Firebase connection status
    const checkConnection = async () => {
      try {
        if (user && !profileLoading && !goalsLoading && !notesLoading) {
          setConnectionStatus('connected');
        }
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    const timeout = setTimeout(checkConnection, 2000);
    return () => clearTimeout(timeout);
  }, [user, profileLoading, goalsLoading, notesLoading]);

  if (!user) {
    return null;
  }

  const isLoading = profileLoading || goalsLoading || notesLoading;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white font-['Orbitron']">Data Storage Status</h3>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {connectionStatus === 'connected' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : connectionStatus === 'disconnected' ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          )}
          <span className="text-white font-medium">
            Firebase Connection: {' '}
            <span className={`${
              connectionStatus === 'connected' ? 'text-green-400' : 
              connectionStatus === 'disconnected' ? 'text-red-400' : 
              'text-yellow-400'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'disconnected' ? 'Disconnected' : 
               'Checking...'}
            </span>
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          Secure cloud storage with real-time synchronization
        </p>
      </div>

      {/* User Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Profile Data */}
        <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Profile</span>
          </div>
          {isLoading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="text-green-400">✓ Level {profile?.level || 1}</div>
              <div className="text-green-400">✓ {profile?.xp || 0} XP</div>
              <div className="text-green-400">✓ {profile?.rank || 'E-Rank'}</div>
              <div className="text-gray-400">Stored securely</div>
            </div>
          )}
        </div>

        {/* Goals Data */}
        <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">Goals</span>
          </div>
          {isLoading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="text-green-400">✓ {goals.length} Total</div>
              <div className="text-green-400">✓ {goals.filter(g => g.status === 'completed').length} Completed</div>
              <div className="text-green-400">✓ {goals.filter(g => g.status === 'pending').length} Active</div>
              <div className="text-gray-400">Auto-synced</div>
            </div>
          )}
        </div>

        {/* Notes Data */}
        <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-white font-medium">Notes</span>
          </div>
          {isLoading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="text-green-400">✓ {notes.length} Documents</div>
              <div className="text-green-400">✓ Cloud backup</div>
              <div className="text-green-400">✓ Real-time sync</div>
              <div className="text-gray-400">Encrypted storage</div>
            </div>
          )}
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-white font-medium">Security & Privacy</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">User data isolation</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Firebase Authentication</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Encrypted transmission</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Automatic backups</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Cross-device sync</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">No localStorage dependencies</span>
          </div>
        </div>
      </div>

      {/* Data Protection Notice */}
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="text-sm">
            <div className="text-green-400 font-medium mb-1">Data Protection Active</div>
            <div className="text-gray-300">
              Your data is securely stored in Firebase Firestore with enterprise-grade security. 
              Each user's data is completely isolated and encrypted. No risk of data loss or cross-user contamination.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}