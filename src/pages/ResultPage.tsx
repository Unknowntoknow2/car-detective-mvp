
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import ValuationResult from '@/components/valuation/ValuationResult';
import { useParams } from 'react-router-dom';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <ValuationResult
          valuationId={id}
        />
      </main>
      <Footer />
    </div>
  );
}
