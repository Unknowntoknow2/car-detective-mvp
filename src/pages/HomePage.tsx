
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedHomePage } from '@/components/home/EnhancedHomePage';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function HomePage() {
  const featureFlags = useFeatureFlags();
  
  return (
    <MainLayout>
      <EnhancedHomePage />
    </MainLayout>
  );
}
