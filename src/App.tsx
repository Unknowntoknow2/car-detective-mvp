import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import VinLookupPage from "@/pages/VinLookupPage";
import ValuationResultPage from "@/pages/ValuationResultPage";
import ValuationPage from "@/pages/valuation/[vin]/ValuationPage";
import PremiumPage from "@/pages/PremiumPage";
import ProfilePage from "@/pages/ProfilePage";
import DealerDashboard from "@/pages/dashboard/DealerDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import DealerInventoryPage from "@/pages/dashboard/DealerInventoryPage";
import SettingsPage from "@/pages/SettingsPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { PricingCards } from "@/components/home/PricingCards";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { CarFinder } from "@/pages/CarFinder";
import { LicensePlateLookupPage } from "@/pages/LicensePlateLookupPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/valuation" element={<VinLookupPage />} />
                <Route path="/valuation/:vin" element={<ValuationPage />} />
                <Route path="/valuation-result" element={<ValuationResultPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dealer/dashboard" element={<DealerDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/dealer/inventory" element={<DealerInventoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/car-finder" element={<CarFinder />} />
                <Route path="/plate-lookup" element={<LicensePlateLookupPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
