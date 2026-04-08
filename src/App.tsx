import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SplashScreen } from "./components/SplashScreen";
// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import WarRoom from "./pages/WarRoom";
import NotFound from "./pages/NotFound";
import Report from "./pages/Report";

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* / → War Room（主要入口，訪客可直接進入） */}
      <Route path="/" component={WarRoom} />

      {/* /war-room → War Room */}
      <Route path="/war-room" component={WarRoom} />

      {/* /report → AI Diagnostic Report */}
      <Route path="/report" component={Report} />

      {/* 側欄功能頁 */}
      <Route path="/projects">
        {() => (
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/clients">
        {() => (
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        )}
      </Route>

      {/* Legacy redirects */}
      <Route path="/dashboard">
        {() => { window.location.replace('/'); return null; }}
      </Route>
      <Route path="/analysis/new">
        {() => { window.location.replace('/'); return null; }}
      </Route>
      <Route path="/analysis/:id">
        {() => { window.location.replace('/'); return null; }}
      </Route>
      <Route path="/projects/:id">
        {() => { window.location.replace('/projects'); return null; }}
      </Route>
      <Route path="/handoff">
        {() => { window.location.replace('/'); return null; }}
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Skip splash screen if accessing /report route
    const isReportRoute = window.location.pathname === '/report';
    if (isReportRoute) {
      setShowSplash(false);
      return;
    }

    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <LanguageProvider>
        <SplashScreen onComplete={handleSplashComplete} />
      </LanguageProvider>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
