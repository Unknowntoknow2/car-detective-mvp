
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import VinLookupPage from "@/pages/VinLookupPage";
import ValuationResultPage from "@/pages/ValuationResultPage";
import ValuationPage from "@/pages/valuation/[vin]/ValuationPage";
import PremiumPage from "@/pages/PremiumPage";
import ProfilePage from "@/pages/ProfilePage";
import DealerDashboard from "@/pages/dashboard/DealerDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import DealerInventoryPage from "@/pages/dealer/DealerInventoryPage";
import SettingsPage from "@/pages/SettingsPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="valuation" element={<VinLookupPage />} />
                  <Route path="valuation/:vin" element={<ValuationPage />} />
                  <Route path="valuation-result" element={<ValuationResultPage />} />
                  <Route path="premium" element={<PremiumPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="dealer/dashboard" element={<DealerDashboard />} />
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                  <Route path="dealer/inventory" element={<DealerInventoryPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsOfServicePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
