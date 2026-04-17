import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SplashScreen } from "./components/SplashScreen";
import Sidebar from "./components/Sidebar";
// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import WarRoom from "./pages/WarRoom";
import NotFound from "./pages/NotFound";
import Report from "./pages/Report";
import HomePage from "./pages/HomePage";
import CasesPage from "./pages/CasesPage";
import InsightsPage from "./pages/InsightsPage";
import AboutPage from "./pages/AboutPage";
import ResourcesPage from "./pages/ResourcesPage";
import TeamPage from './pages/TeamPage';

// Pages that show sidebar
const SIDEBAR_ROUTES = ['/home', '/cases', '/insights', '/about', '/team', '/resources'];

function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="orion-layout-with-sidebar">
      <Sidebar />
      <main className="orion-main-content" style={{ paddingBottom: 80 }}>
        {children}
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const showSidebar = SIDEBAR_ROUTES.some(r => location === r || location.startsWith(r + '/'));

  if (showSidebar) {
    return (
      <SidebarLayout>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route path="/cases" component={CasesPage} />
          <Route path="/insights" component={InsightsPage} />
          <Route path="/about" component={AboutPage} />
              <Route path="/team" component={TeamPage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route component={NotFound} />
        </Switch>
      </SidebarLayout>
    );
  }

  return (
    <Switch>
      {/* Public */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* / → HomePage（主要入口） */}
      <Route path="/">
        {() => {
          window.location.replace('/home');
          return null;
        }}
      </Route>

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
        {() => { window.location.replace('/home'); return null; }}
      </Route>
      <Route path="/analysis/new">
        {() => { window.location.replace('/home'); return null; }}
      </Route>
      <Route path="/analysis/:id">
        {() => { window.location.replace('/home'); return null; }}
      </Route>
      <Route path="/projects/:id">
        {() => { window.location.replace('/projects'); return null; }}
      </Route>
      <Route path="/handoff">
        {() => { window.location.replace('/home'); return null; }}
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}


// ========== Global ShootingStars (all pages) ==========
function ShootingStars() {
  return (
    <div className="shooting-stars-container">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={`dust-${i}`}
          className="star-dust"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 12}s`,
            width: `${1 + Math.random() * 1.5}px`,
            height: `${1 + Math.random() * 1.5}px`,
          }}
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`meteor-${i}`}
          className="meteor"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${Math.random() * 30}%`,
            animationDuration: `${8 + i * 4}s`,
            animationDelay: `${i * 3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}


function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const skipSplash = ['/report', '/war-room', '/home', '/cases', '/insights', '/about', '/resources'];
    if (skipSplash.some(r => path.startsWith(r))) {
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
      <>
      <ShootingStars />
      <LanguageProvider>        <SplashScreen onComplete={handleSplashComplete} />
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
      </>
  );
}

export default App;
