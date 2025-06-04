<<<<<<< HEAD

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
=======
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RotateCcw, Search } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const NotFound: React.FC = () => {
  return (
<<<<<<< HEAD
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
=======
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>

        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. If you
          were trying to view a valuation result, it may have expired or been
          deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" onClick={() => navigate("/")}>
            Go to Home
          </Button>

          <Button variant="outline" onClick={() => navigate("/free")}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Valuation
          </Button>

          <Button variant="outline" onClick={() => navigate("/vin-lookup")}>
            <Search className="mr-2 h-4 w-4" />
            VIN Lookup
          </Button>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </div>
  );
};

export default NotFound;
