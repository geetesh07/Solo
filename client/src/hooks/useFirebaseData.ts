import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { userDataManager, Goal, Category, Note, UserProfile, UserSettings } from '@/lib/userDataManager';
import { useToast } from './use-toast';

// User Profile Hook
export function useUserProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userDataManager.getUserProfile(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) => 
      userDataManager.updateUserProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile Updated",
        description: "Your hunter profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    },
  });
}

// Goals Hooks
export function useUserGoals() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-goals'],
    queryFn: () => userDataManager.getUserGoals(),
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds for more real-time feel
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      userDataManager.createGoal(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      toast({
        title: "Quest Created",
        description: "New quest has been added to your journal.",
      });
    },
    onError: (error) => {
      toast({
        title: "Quest Creation Failed",
        description: "Failed to create quest. Please try again.",
        variant: "destructive",
      });
      console.error('Goal creation error:', error);
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ goalId, updates }: { goalId: string; updates: Partial<Goal> }) =>
      userDataManager.updateGoal(goalId, updates),
    onSuccess: (_, { updates }) => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] }); // Update XP
      
      if (updates.status === 'completed') {
        toast({
          title: "Quest Completed! 🎉",
          description: `You've gained ${updates.xpReward || 10} XP! Keep up the great work, Hunter!`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update quest. Please try again.",
        variant: "destructive",
      });
      console.error('Goal update error:', error);
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (goalId: string) => userDataManager.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      toast({
        title: "Quest Removed",
        description: "Quest has been removed from your journal.",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: "Failed to remove quest. Please try again.",
        variant: "destructive",
      });
      console.error('Goal deletion error:', error);
    },
  });
}

// Categories Hooks
export function useUserCategories() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-categories'],
    queryFn: () => userDataManager.getUserCategories(),
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ categoryId, updates }: { categoryId: string; updates: Partial<Category> }) =>
      userDataManager.updateCategory(categoryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-categories'] });
      toast({
        title: "Category Updated",
        description: "Quest category has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
      console.error('Category update error:', error);
    },
  });
}

// Notes Hooks
export function useUserNotes() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-notes'],
    queryFn: () => userDataManager.getUserNotes(),
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      userDataManager.createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notes'] });
      toast({
        title: "Note Created",
        description: "New entry added to Shadow Archive.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
      console.error('Note creation error:', error);
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ noteId, updates }: { noteId: string; updates: Partial<Note> }) =>
      userDataManager.updateNote(noteId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notes'] });
      toast({
        title: "Note Updated",
        description: "Archive entry has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
      console.error('Note update error:', error);
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (noteId: string) => userDataManager.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notes'] });
      toast({
        title: "Note Deleted",
        description: "Entry has been removed from Shadow Archive.",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
      console.error('Note deletion error:', error);
    },
  });
}

// Settings Hook
export function useUserSettings() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-settings'],
    queryFn: () => userDataManager.getUserSettings(),
    enabled: !!user,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (settings: Partial<UserSettings>) =>
      userDataManager.updateUserSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error('Settings update error:', error);
    },
  });
}