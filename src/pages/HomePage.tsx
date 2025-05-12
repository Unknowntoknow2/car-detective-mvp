
import React from 'react';
import { EnhancedErrorBoundary } from '@/components/common/EnhancedErrorBoundary';
import Home from './Home';
import { ValuationProvider } from '@/contexts/ValuationContext';

export default function HomePage() {
  return (
    <EnhancedErrorBoundary>
      <Home />
    </EnhancedErrorBoundary>
  );
}
