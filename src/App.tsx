import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import ApplicationTracker from "./pages/ApplicationTracker";
import ApplicationDetail from "./pages/ApplicationDetail";
import ManageApplications from "./pages/ManageApplications";
import ManageJobs from "./pages/ManageJobs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import CompanyProfile from "./pages/CompanyProfile";
import SavedJobs from "./pages/SavedJobs";
import PostJob from "./pages/PostJob";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Sitemap from "./pages/Sitemap";
import ZapierIntegration from "./pages/ZapierIntegration";
import Conversations from "./pages/Conversations";
import Dashboard from "./pages/Dashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import ResetPassword from '@/pages/ResetPassword';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LazyMotion features={domAnimation}>
            <BrowserRouter>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/companies/:id" element={<CompanyDetail />} />
                  <Route path="/application-tracker" element={<ApplicationTracker />} />
                  <Route path="/application-detail/:id" element={<ApplicationDetail />} />
                  <Route path="/manage-applications" element={<ManageApplications />} />
                  <Route path="/manage-jobs" element={<ManageJobs />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/company-profile" element={<CompanyProfile />} />
                  <Route path="/saved-jobs" element={<SavedJobs />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/zapier-integration" element={<ZapierIntegration />} />
                  <Route path="/messages" element={<Conversations />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
                  <Route path="/dashboard/employer" element={<EmployerDashboard />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </LazyMotion>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
