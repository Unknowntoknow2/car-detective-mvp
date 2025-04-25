
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import VinLookupPage from "./pages/VinLookupPage";
import PlateLookupPage from "./pages/PlateLookupPage";
import ManualLookupPage from "./pages/ManualLookupPage";
import FreeValuationPage from "./pages/FreeValuationPage";
import PremiumPage from "./pages/PremiumPage";
import Index from "./pages/Index";
import PremiumSuccessPage from "./pages/PremiumSuccessPage";

// Import i18n config
import './i18n/config';

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
            <Route path="/valuation/free" element={<FreeValuationPage />} />
            <Route path="/valuation/premium" element={<PremiumPage />} />
            <Route path="/valuation/premium-success" element={<PremiumSuccessPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
