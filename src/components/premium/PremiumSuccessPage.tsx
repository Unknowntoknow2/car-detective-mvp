
// Add a check to handle undefined values before using the valuationId
// This is a partial fix assuming the component exists
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PremiumSuccessPage = () => {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();

  // Navigation handlers
  const handleViewValuation = () => {
    if (valuationId) {
      navigate(`/valuation/${valuationId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGetDealerOffers = () => {
    if (valuationId) {
      navigate(`/dealer-offers/${valuationId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Premium Upgrade Successful!</h1>
        <p className="text-lg mb-8">
          You now have access to premium features including detailed valuation analytics,
          dealer offers, and comprehensive vehicle history reports.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleViewValuation} size="lg">
            View Enhanced Valuation
          </Button>
          <Button onClick={handleGetDealerOffers} variant="outline" size="lg">
            Get Dealer Offers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumSuccessPage;
