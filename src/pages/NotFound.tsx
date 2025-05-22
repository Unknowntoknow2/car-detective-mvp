
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-7xl font-bold text-primary mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="gap-2">
          <Link to="/valuation">
            <Search className="h-4 w-4" />
            <span>Get a Car Valuation</span>
          </Link>
        </Button>
        
        <Button asChild variant="ghost" className="gap-2" onClick={() => window.history.back()}>
          <Link to="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
