
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import UpgradePage from './pages/UpgradePage';
import PremiumPage from './pages/PremiumPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ValuationFollowupPage from './pages/ValuationFollowupPage';
import ValuationResultPage from './pages/ValuationResultPage';
import VinLookupPage from './pages/VinLookupPage';
import AuthLandingPage from './pages/auth/AuthLandingPage';
import SignInPage from './pages/auth/SigninPage';
import SignUpPage from './pages/auth/SignupPage';
import RegisterPage from './pages/auth/RegisterPage';
import DealerSignupPage from './pages/auth/DealerSignupPage';
import ChooseRolePage from './pages/auth/ChooseRolePage';
import IndividualAuthPage from './pages/auth/IndividualAuthPage';
import DealerAuthPage from './pages/auth/DealerAuthPage';
import { NotFoundPage } from './pages';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerInventoryListPage from './pages/dealer/DealerInventoryListPage';
import ValuationHomepage from './modules/valuation-homepage/page';
import { AppProviders } from './providers/AppProviders';
import ResultPage from './pages/ResultPage';
import ResultsPage from './pages/ResultsPage';
import ValuationDetailPage from './pages/ValuationDetailPage';
import { AIAssistantDrawer } from './components/chat/AIAssistantDrawer';

function App() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <AppProviders>
      <AIAssistantDrawer 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Landing and Home Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/valuation" element={<ValuationHomepage />} />
        
        {/* Premium Features */}
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium-success" element={<PremiumSuccessPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        
        {/* User Dashboard */}
        <Route path="/dashboard" element={<UserDashboardPage />} />
        
        {/* Valuation Process */}
        <Route path="/valuation-followup" element={<ValuationFollowupPage />} />
        <Route path="/valuation-result" element={<ValuationResultPage />} />
        <Route path="/valuation-detail/:id" element={<ValuationDetailPage />} />
        <Route path="/vin-lookup" element={<VinLookupPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        
        {/* Authentication - Support both old and new paths */}
        <Route path="/auth" element={<AuthLandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dealer-signup" element={<DealerSignupPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/login-user" element={<IndividualAuthPage />} />
        <Route path="/login-dealer" element={<DealerAuthPage />} />
        
        {/* New Auth Flow */}
        <Route path="/auth/choose-role" element={<ChooseRolePage />} />
        <Route path="/auth/individual" element={<IndividualAuthPage />} />
        <Route path="/auth/dealer" element={<DealerAuthPage />} />
        
        {/* Legacy auth paths for backward compatibility */}
        <Route path="/signin/individual" element={<IndividualAuthPage />} />
        <Route path="/signin/dealer" element={<DealerAuthPage />} />
        <Route path="/signup/individual" element={<IndividualAuthPage />} />
        <Route path="/signup/dealer" element={<DealerAuthPage />} />
        
        {/* Dealer Pages */}
        <Route path="/dealer/dashboard" element={<DealerDashboardPage />} />
        <Route path="/dealer-dashboard" element={<DealerDashboardPage />} />
        <Route path="/dealer/inventory" element={<DealerInventoryListPage />} />
        
        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  );
}

export default App;
