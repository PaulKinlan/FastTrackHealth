import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "./lib/auth";
import { NavHeader } from "./components/nav-header";
import Dashboard from "./pages/dashboard";
import History from "./pages/history";
import NotFound from "./pages/not-found";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    window.location.href = "/api/auth/google";
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={() => <PrivateRoute component={Dashboard} />} />
          <Route path="/history" component={() => <PrivateRoute component={History} />} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
