
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VehicleHistorySection } from '@/components/title-ownership/VehicleHistorySection';

export default function VehicleHistoryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-2">Vehicle History</h1>
          <p className="text-center text-muted-foreground mb-8">
            Track service history, title status, and ownership information to improve valuation accuracy.
          </p>
          
          <VehicleHistorySection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
