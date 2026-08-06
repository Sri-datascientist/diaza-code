import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAnalytics } from "@/hooks/useAnalytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Process from "@/pages/Process";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Project from "@/pages/Project";
import Reviews from "@/pages/Reviews";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLeads from "@/pages/admin/Leads";
import AdminPortfolio from "@/pages/admin/Portfolio";
import AdminSEO from "@/pages/admin/SEO";

function Router() {
  useAnalytics();
  
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/portfolio" component={AdminPortfolio} />
      <Route path="/admin/seo" component={AdminSEO} />
      <Route path="/admin">
        {() => <Redirect to="/admin/dashboard" />}
      </Route>

      {/* Public Routes */}
      <Route path="/">
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      <Route path="/project">
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Project />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      <Route path="/about">
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <About />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      <Route path="/process">
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Process />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      <Route path="/contact">
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Contact />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      <Route path="/reviews">
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Reviews />
            </main>
            <Footer />
          </div>
        )}
      </Route>
      
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <NotFound />
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
