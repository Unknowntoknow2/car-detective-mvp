
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { usePremiumPayment } from '@/hooks/usePremiumPayment';

const PremiumSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyPaymentSession, isLoading } = usePremiumPayment();
  const [verified, setVerified] = useState(false);
  const [valuationId, setValuationId] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      verifyPaymentSession(sessionId).then((result) => {
        setVerified(result.success);
        if (result.valuationId) {
          setValuationId(result.valuationId);
        }
      });
    }
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isLoading ? (
          <div className="py-10">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </div>
        ) : verified ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your purchase! Your premium valuation report is now available.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate(valuationId ? `/valuation/${valuationId}` : '/my-valuations')}
                className="w-full"
              >
                View Premium Report
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-amber-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Payment Processing</h1>
            
            <p className="text-gray-600 mb-6">
              Your payment is being processed. This may take a few moments. 
              We'll notify you when your premium features are unlocked.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/my-valuations')}
                className="w-full"
              >
                View My Valuations
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumSuccessPage;
