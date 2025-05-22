
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b py-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">AutoValue</Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to="/vin-lookup" className="text-sm font-medium hover:text-primary">VIN Lookup</Link>
          <Link to="/premium" className="text-sm font-medium hover:text-primary">Premium</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/premium">Get Premium</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
