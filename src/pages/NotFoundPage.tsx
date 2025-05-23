
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, AlertTriangleIcon } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangleIcon className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/valuation">
              Get a Valuation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
