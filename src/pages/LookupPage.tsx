
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const LookupPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">Vehicle Lookup</h1>
        <p className="text-gray-600 mb-8">
          Enter your vehicle information to get started with your valuation.
        </p>
        {/* Placeholder for actual lookup components */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <p>Lookup components will be rendered here</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LookupPage;
