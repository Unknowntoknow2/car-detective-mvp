
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
          If you were trying to view a valuation result, it may have expired or been deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" onClick={() => navigate('/')}>
            Go to Home
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/free')}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Valuation
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/vin-lookup')}>
            <Search className="mr-2 h-4 w-4" />
            VIN Lookup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
