
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8 bg-slate-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">AutoValue</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted source for accurate vehicle valuations and market insights.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vin-lookup" className="hover:underline">VIN Lookup</Link></li>
              <li><Link to="/premium" className="hover:underline">Premium Valuation</Link></li>
              <li><Link to="/valuation-followup" className="hover:underline">Valuation Details</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">About Us</Link></li>
              <li><Link to="/" className="hover:underline">Contact</Link></li>
              <li><Link to="/" className="hover:underline">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {year} AutoValue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
