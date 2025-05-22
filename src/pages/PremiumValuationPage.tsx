
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { PremiumUpgradeCTA } from '@/components/premium/PremiumUpgradeCTA';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/hooks/useAuth';
import { verifyPaymentSession } from '@/utils/stripeClient';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PremiumValuationPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading: authLoading, user } = useAuth();
  const { hasPremiumAccess, isLoading: accessLoading, usePremiumCredit } = usePremiumAccess(valuationId);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'none'>('none');
  const [statusMessage, setStatusMessage] = useState('');
  
  const isLoading = authLoading || accessLoading;
  
  // Check if returning from Stripe checkout
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const premiumParam = searchParams.get('premium');
    
    if (sessionId) {
      setIsVerifying(true);
      
      verifyPaymentSession(sessionId)
        .then(data => {
          if (data.success) {
            setPaymentStatus('success');
            setStatusMessage('Payment successful! Premium features are now unlocked.');
            
            // If we have a valuation ID, use a credit to unlock it
            if (valuationId && data.bundle > 0) {
              return usePremiumCredit(valuationId);
            }
          } else {
            setPaymentStatus('error');
            setStatusMessage('Payment verification failed. Please try again or contact support.');
          }
        })
        .catch(error => {
          console.error('Error verifying payment:', error);
          setPaymentStatus('error');
          setStatusMessage('Failed to verify payment. Please try again or contact support.');
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else if (premiumParam === '1') {
      setPaymentStatus('success');
      setStatusMessage('Premium features are now available!');
    }
  }, [searchParams, valuationId, usePremiumCredit]);
  
  const handleViewValuation = () => {
    if (valuationId) {
      navigate(`/valuation/${valuationId}`);
    } else {
      navigate('/account');
    }
  };
  
  if (isLoading || isVerifying) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">
              {isVerifying ? 'Verifying payment...' : 'Loading...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (paymentStatus === 'success') {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Payment Successful
            </CardTitle>
            <CardDescription className="text-lg">
              {statusMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mt-4">
              <Button onClick={handleViewValuation}>
                {valuationId ? 'View Valuation' : 'Go to Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (paymentStatus === 'error') {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Payment Error
            </CardTitle>
            <CardDescription className="text-lg">
              {statusMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setPaymentStatus('none')}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (hasPremiumAccess && valuationId) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Premium Already Unlocked
            </CardTitle>
            <CardDescription className="text-lg">
              You already have premium access to this valuation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mt-4">
              <Button onClick={handleViewValuation}>
                View Valuation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
        <p className="text-muted-foreground">
          Get comprehensive valuation insights with premium features
        </p>
      </div>
      
      <PremiumUpgradeCTA valuationId={valuationId} />
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">What's included with Premium</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Comprehensive Vehicle Analysis</h3>
            <p className="text-muted-foreground">
              Get detailed insights into your vehicle's condition, market position, and pricing factors.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">CARFAX Integration</h3>
            <p className="text-muted-foreground">
              Access vehicle history data including accidents, service records, and title information.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Detailed PDF Reports</h3>
            <p className="text-muted-foreground">
              Download professional-quality reports for your records or to share with potential buyers.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Market Comparison</h3>
            <p className="text-muted-foreground">
              See how your vehicle stacks up against similar models in your local market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
