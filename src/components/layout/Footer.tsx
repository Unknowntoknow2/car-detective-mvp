
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Car Detective</h3>
            <p className="text-gray-600 text-sm">
              AI-powered vehicle valuation platform providing accurate market insights.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/valuation" className="hover:text-gray-900">Free Valuation</a></li>
              <li><a href="/premium" className="hover:text-gray-900">Premium Report</a></li>
              <li><a href="/vin-lookup" className="hover:text-gray-900">VIN Lookup</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-gray-900">About</a></li>
              <li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
              <li><a href="/privacy" className="hover:text-gray-900">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/help" className="hover:text-gray-900">Help Center</a></li>
              <li><a href="/faq" className="hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2024 Car Detective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Named export for compatibility
export const Footer = Footer;
// Default export
export default Footer;
