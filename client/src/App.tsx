import { Router, Route, Switch } from "wouter";
import Dashboard from "@/pages/Dashboard";
import "@/index.css";

function App() {
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

export default App;