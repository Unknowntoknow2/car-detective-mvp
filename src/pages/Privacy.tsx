
import React from 'react';

const Privacy = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: May 13, 2025</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information about your vehicle, including but not limited to make, model, year, VIN, condition, and mileage. We may also collect personal information such as your name, email address, and ZIP code to provide our services.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use your information to provide vehicle valuations, improve our services, and contact you about relevant offers if you've opted in to receive communications.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
        <p>We may share anonymized vehicle data for market analysis. If you opt in to dealer offers, your vehicle information (but not personal details) may be shared with our dealer network.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
        <p>We implement appropriate security measures to protect your information from unauthorized access or disclosure.</p>
      </div>
    </div>
  );
};

export default Privacy;
