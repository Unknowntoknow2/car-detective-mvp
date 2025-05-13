
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Car Detective</h3>
            <p className="text-gray-600">
              Get accurate car valuations using advanced AI technology and comprehensive market data.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link to="/free-valuation" className="text-gray-600 hover:text-primary">Free Valuation</Link></li>
              <li><Link to="/premium" className="text-gray-600 hover:text-primary">Premium Reports</Link></li>
              <li><Link to="/my-valuations" className="text-gray-600 hover:text-primary">My Valuations</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/vin-lookup" className="text-gray-600 hover:text-primary">VIN Lookup</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact Us</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-primary">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Car Detective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
