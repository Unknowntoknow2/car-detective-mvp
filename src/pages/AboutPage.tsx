
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">About Our Vehicle Valuation Service</h1>
      
      <div className="space-y-6">
        <p>
          Welcome to our premier vehicle valuation platform. We provide accurate, data-driven valuations
          for automobiles of all makes and models.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
        <p>
          Our mission is to bring transparency to vehicle valuation through advanced analytics
          and comprehensive data collection, giving our users the confidence they need
          when buying, selling, or insuring vehicles.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">How It Works</h2>
        <p>
          Our valuation engine combines historical transaction data, current market trends,
          vehicle condition assessments, and regional market factors to deliver the most
          accurate vehicle valuations possible.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">Our Team</h2>
        <p>
          Our team consists of automotive industry experts, data scientists, and software
          engineers who are passionate about delivering the best vehicle valuation experience.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
