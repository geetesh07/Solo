import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ToastContainer } from "@/components/ui/toast";
import { PWAInstallPrompt } from "@/components/features/PWAInstallPrompt";
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-cyan-400 font-['Orbitron'] text-xl">Awakening Hunter System...</div>
          <div className="text-gray-400 text-sm mt-2">Please wait while we initialize your dashboard</div>
        </div>
      </div>
    );
  }

  // If no user, show login page
  if (!user) {
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProtectedRoutes />
          <ToastContainer />
          <PWAInstallPrompt />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;