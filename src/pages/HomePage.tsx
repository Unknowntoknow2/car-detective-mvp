
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedHomePage } from '@/components/home/EnhancedHomePage';

export default function HomePage() {
  return (
    <MainLayout>
      <EnhancedHomePage />
    </MainLayout>
  );
}
