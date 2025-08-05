import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { userDataManager } from "./userDataManager";

// Since we're using Firebase Firestore directly, we don't need the backend API
// Let's create Firebase-native query functions

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For the few remaining API calls, keep the existing implementation
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Firebase-native query functions
export const firebaseQueryFn: QueryFunction<any> = async ({ queryKey, meta }) => {
  const [resource, ...params] = queryKey as string[];
  
  try {
    switch (resource) {
      case 'user-profile':
        return await userDataManager.getUserProfile();
      
      case 'user-goals':
        return await userDataManager.getUserGoals();
      
      case 'user-categories':
        return await userDataManager.getUserCategories();
      
      case 'user-notes':
        return await userDataManager.getUserNotes();
      
      case 'user-settings':
        return await userDataManager.getUserSettings();
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  } catch (error) {
    console.error(`Query failed for ${resource}:`, error);
    throw error;
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      return await firebaseQueryFn({ queryKey, meta: undefined });
    } catch (error: any) {
      if (unauthorizedBehavior === "returnNull" && error.message?.includes('not authenticated')) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: firebaseQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
