
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingComponent from './components/ui/loading-component';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import { AuthProvider } from './contexts/AuthContext';

// Lazy-loaded pages
const Index = lazy(() => import('./pages/Index'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ValuationPage = lazy(() => import('./pages/ValuationPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PremiumValuationPage = lazy(() => import('./pages/PremiumValuationPage'));
const FindDealerPage = lazy(() => import('./pages/FindDealerPage'));
const MyValuationsPage = lazy(() => import('./pages/MyValuationsPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingComponent />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/valuation" element={<ValuationPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/premium-valuation" element={<PremiumValuationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/find-dealer" element={<FindDealerPage />} />
              <Route path="/my-valuations" element={<MyValuationsPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
