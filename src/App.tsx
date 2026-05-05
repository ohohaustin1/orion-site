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
import Starfield from "./components/Starfield";
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
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

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

      {/* Legal pages — required for OAuth App Review (T-OAUTH-APPREVIEW-PREP) */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

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

      {/* T7：staging 預覽路由（用 fixture、不打 LLM） */}
      <Route path="/report/preview/:templateName">
        {(params: { templateName: string }) => <Report previewTemplate={params.templateName} />}
      </Route>

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


function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const skipSplash = ['/report', '/war-room', '/home', '/cases', '/insights', '/about', '/team', '/resources', '/privacy', '/terms'];
    if (skipSplash.some(r => path.startsWith(r))) {
      setShowSplash(false);
    } else {
      const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
      if (hasSeenSplash) setShowSplash(false);
    }

    // TD-007 SSR：通知 @prerenderer/rollup-plugin 快照可以開始
    // 等下一輪 idle / 動畫起始 frame，給 React commit + 字型有時間 settle
    const t = setTimeout(() => {
      try {
        document.dispatchEvent(new Event('render-event'));
      } catch { /* SSR-safe noop */ }
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <>
      <Starfield />
      <LanguageProvider>        <SplashScreen onComplete={handleSplashComplete} />
      </LanguageProvider>
      </>
    );
  }

  return (
    <>
    <Starfield />
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
