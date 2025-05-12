
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';
import { ValuationProvider } from '@/contexts/ValuationContext';

// Lazy load the content component for improved performance
const MyValuationsContent = lazy(() => import('@/components/user/MyValuationsContent'));

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold">Loading your valuations...</h2>
      </div>
    </main>
    <Footer />
  </div>
);

// Error state component
const ErrorState = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow flex items-center justify-center p-4">
      <div className="text-center p-6 rounded-lg border border-red-200 bg-red-50 max-w-md">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Unable to load valuations</h2>
        <p className="text-red-600 mb-4">
          We encountered an issue while trying to load your valuation history. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    </main>
    <Footer />
  </div>
);

export default function MyValuationsPage() {
  return (
    <ErrorBoundary fallback={<ErrorState />}>
      <ValuationProvider>
        <Suspense fallback={<LoadingState />}>
          <MyValuationsContent />
        </Suspense>
      </ValuationProvider>
    </ErrorBoundary>
  );
}
