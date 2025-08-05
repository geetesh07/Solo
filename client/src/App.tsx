import { useEffect } from "react";
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

  // CRITICAL: Enforce authentication - ABSOLUTELY NO bypassing allowed
  if (!user) {
    console.log('ProtectedRoutes: No user, redirecting to login');
    return <Login />;
  }

  // CRITICAL: Triple-check authentication before allowing access
  if (!user.uid || !user.email) {
    console.log('ProtectedRoutes: Invalid user data, redirecting to login');
    return <Login />;
  }

  // PRODUCTION SAFETY: Additional validation
  if (typeof user.uid !== 'string' || user.uid.length < 10) {
    console.log('ProtectedRoutes: Invalid user ID format, redirecting to login');
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
  // Force Solo Leveling theme for production consistency  
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.cssText = `
      background: #0a0a0f !important;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(0, 150, 255, 0.1) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.08) 0%, transparent 40%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(13, 13, 25, 0.95) 100%) !important;
      background-attachment: fixed !important;
      color: #f8fafc !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
      min-height: 100vh !important;
    `;
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <div 
              className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" 
              style={{
                background: '#0a0a0f',
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(0, 150, 255, 0.1) 0%, transparent 40%),
                  radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.08) 0%, transparent 40%),
                  linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(13, 13, 25, 0.95) 100%)
                `,
                backgroundAttachment: 'fixed',
                minHeight: '100vh'
              }}
            >
              <ProtectedRoutes />
            </div>
            <ToastContainer />
            <PWAInstallPrompt />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;