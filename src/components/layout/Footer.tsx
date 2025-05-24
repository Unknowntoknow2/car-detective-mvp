
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Car Detective</h3>
            <p className="text-muted-foreground text-sm">
              Get accurate valuations and detailed reports for your vehicle.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/valuation" className="text-muted-foreground hover:text-foreground">Basic Valuation</Link></li>
              <li><Link to="/premium-valuation" className="text-muted-foreground hover:text-foreground">Premium Valuation</Link></li>
              <li><Link to="/vin-lookup" className="text-muted-foreground hover:text-foreground">VIN Lookup</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth" className="text-muted-foreground hover:text-foreground">Sign In</Link></li>
              <li><Link to="/auth/individual" className="text-muted-foreground hover:text-foreground">Individual Account</Link></li>
              <li><Link to="/auth/dealer" className="text-muted-foreground hover:text-foreground">Dealer Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Car Detective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
