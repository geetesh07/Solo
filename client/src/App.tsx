import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ToastContainer } from "@/components/ui/Toast";
import { PWAInstallPrompt } from "@/components/features/PWAInstallPrompt";
import Dashboard from "@/pages/Dashboard";
import "@/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
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
          <ToastContainer />
          <PWAInstallPrompt />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;