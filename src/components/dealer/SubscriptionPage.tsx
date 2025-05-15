
import React from 'react';
import { PremiumPlansSection } from './PremiumPlansSection';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const DealerSubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show toast on successful subscription
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subscription = params.get('subscription');
    
    if (subscription === 'success') {
      toast.success('Subscription activated successfully!');
      // Clear the query params to prevent showing the toast on refresh
      navigate('/dealer-dashboard', { replace: true });
    } else if (subscription === 'canceled') {
      toast.info('Subscription process canceled');
      // Clear the query params to prevent showing the toast on refresh
      navigate('/dealer-dashboard', { replace: true });
    }
  }, [location, navigate]);

  if (!user) {
    return <div className="container py-12 text-center">Please sign in to access dealer subscriptions.</div>;
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dealer-dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <PremiumPlansSection />
      </div>
    </div>
  );
}

export default DealerSubscriptionPage;
