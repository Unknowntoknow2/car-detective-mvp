
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border text-muted-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Section 1: Brand */}
        <div>
          <h3 className="text-xl font-semibold text-foreground">Car Detective</h3>
          <p className="text-sm mt-2">The AI-Powered Car Valuation System</p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/valuation" className="hover:underline">Free Valuation</Link></li>
            <li><Link to="/premium" className="hover:underline">Premium Report</Link></li>
            <li><Link to="/dealer" className="hover:underline">For Dealers</Link></li>
          </ul>
        </div>

        {/* Section 3: Legal */}
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Section 4: Contact */}
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: <a href="mailto:support@cardetective.com" className="hover:underline">support@cardetective.com</a></li>
            <li>Phone: <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs mt-8 text-muted-foreground">
        © {new Date().getFullYear()} Car Detective™. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
