
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { FreeValuationPage } from '@/pages/FreeValuationPage';
import { PremiumPage } from '@/pages/PremiumPage';
import { ValuationResultPage } from '@/pages/ValuationResultPage';
import { VinLookupPage } from '@/pages/VinLookupPage';
import { PlateLookupPage } from '@/pages/PlateLookupPage';
import { ManualEntryPage } from '@/pages/ManualEntryPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DealerDashboardPage } from '@/pages/DealerDashboardPage';
import { AuthPage } from '@/pages/AuthPage';
import { ValuationDetailPage } from '@/pages/ValuationDetailPage';
import { ContactPage } from '@/pages/ContactPage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { PremiumCheckoutPage } from '@/pages/PremiumCheckoutPage';
import { PremiumSuccessPage } from '@/pages/PremiumSuccessPage';
import { DealerSignupPage } from '@/pages/DealerSignupPage';
import { DealerSubscriptionPage } from '@/pages/DealerSubscriptionPage';
import { ValuationFollowUpPage } from '@/pages/ValuationFollowUpPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/free-valuation" element={<FreeValuationPage />} />
      <Route path="/premium" element={<PremiumPage />} />
      <Route path="/vin-lookup" element={<VinLookupPage />} />
      <Route path="/plate-lookup" element={<PlateLookupPage />} />
      <Route path="/manual-entry" element={<ManualEntryPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dealer-dashboard" element={<DealerDashboardPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/premium/checkout" element={<PremiumCheckoutPage />} />
      <Route path="/premium/success" element={<PremiumSuccessPage />} />
      <Route path="/dealer/signup" element={<DealerSignupPage />} />
      <Route path="/dealer/subscription" element={<DealerSubscriptionPage />} />
      <Route path="/valuation-followup" element={<ValuationFollowUpPage />} />
      
      {/* Fixed routing - separate VIN and UUID routes */}
      <Route path="/valuation/vin/:vin" element={<ValuationResultPage />} />
      <Route path="/valuation/:id" element={<ValuationResultPage />} />
      <Route path="/valuation-detail/:id" element={<ValuationDetailPage />} />
    </Routes>
  );
}
