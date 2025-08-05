import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ToastContainer } from "@/components/ui/toast";
import { PWAInstallPrompt } from "@/components/features/PWAInstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import "@/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Routes Component - only renders if user is authenticated
function ProtectedRoutes() {
  const { user, loading } = useAuth();

  // CRITICAL: Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-cyan-400 font-['Orbitron'] text-xl">Authenticating...</div>
          <div className="text-gray-400 text-sm mt-2">
            Connecting to Firebase...
          </div>
        </div>
      </div>
    );
  }

  // CRITICAL: Enforce authentication - no bypassing allowed
  if (!user) {
    return <Login />;
  }

  // Double-check authentication before allowing access
  if (!user.uid || !user.email) {
    return <Login />;
  }

  // If authenticated, show protected routes
  return (
    <Router>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/settings" component={Dashboard} />
        <Route path="/analytics" component={Dashboard} />
        <Route path="/calendar" component={Dashboard} />
        <Route path="/notes" component={Dashboard} />
        <Route path="/streaks" component={Dashboard} />
        {/* Fallback to dashboard for any unmatched routes */}
        <Route component={Dashboard} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ProtectedRoutes />
            <ToastContainer />
            <PWAInstallPrompt />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;