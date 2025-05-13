
import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: May 13, 2025</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using our vehicle valuation services, you agree to be bound by these Terms of Service.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
        <p>Our service provides vehicle valuation estimates based on the information provided by users and market data. These valuations are estimates only and should not be considered guaranteed prices.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
        <p>Users are responsible for providing accurate and complete information about their vehicles. Inaccurate information may result in inaccurate valuations.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. Limitations of Liability</h2>
        <p>We provide our service on an "as is" basis and make no warranties regarding the accuracy of valuations. We shall not be liable for any decisions made based on our valuations.</p>
      </div>
    </div>
  );
};

export default Terms;
