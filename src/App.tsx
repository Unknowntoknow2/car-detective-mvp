import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import VinLookupPage from "./pages/VinLookupPage";
import PlateLookupPage from "./pages/PlateLookupPage";
import ManualLookupPage from "./pages/ManualLookupPage";
import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MyValuationsPage from "./pages/MyValuationsPage";
import NotFound from "./pages/NotFound";
import DealerDashboard from "./pages/DealerDashboard";
import DealerSignup from "./pages/dealer/signup";
import ProfilePage from "./pages/ProfilePage";
import DealerOffersPage from "./pages/dealer/DealerOffersPage";
import PremiumPage from "./pages/PremiumPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lookup/vin" element={<VinLookupPage />} />
            <Route path="/lookup/plate" element={<PlateLookupPage />} />
            <Route path="/lookup/manual" element={<ManualLookupPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/signup" element={<AuthPage />} />
            <Route path="/auth/forgot-password" element={<AuthPage />} />
            <Route path="/auth/forgot-email" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/valuations" 
              element={
                <ProtectedRoute>
                  <MyValuationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dealer/dashboard" 
              element={
                <ProtectedRoute>
                  <DealerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/dealer/signup" element={<DealerSignup />} />
            <Route path="/dealer/offers" element={
              <ProtectedRoute>
                <DealerOffersPage />
              </ProtectedRoute>
            } />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
