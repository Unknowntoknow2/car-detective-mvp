
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePremiumPayment } from '@/hooks/usePremiumPayment';
import { Container } from '@/components/ui/container';

export default function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const valuationId = searchParams.get('valuation_id');
  const navigate = useNavigate();
  const { verifyPaymentSession, isLoading } = usePremiumPayment();
  const [verificationComplete, setVerificationComplete] = useState(false);
  
  useEffect(() => {
    if (sessionId) {
      // Store the valuation ID as premium in localStorage for demo purposes
      if (valuationId) {
        const premiumIds = JSON.parse(localStorage.getItem('premium_valuations') || '[]');
        if (!premiumIds.includes(valuationId)) {
          premiumIds.push(valuationId);
          localStorage.setItem('premium_valuations', JSON.stringify(premiumIds));
        }
      }
      
      // Verify the payment session
      verifyPaymentSession(sessionId)
        .then(() => {
          setVerificationComplete(true);
        })
        .catch(console.error);
    }
  }, [sessionId, valuationId, verifyPaymentSession]);
  
  const handleViewReport = () => {
    if (valuationId) {
      navigate(`/valuation/${valuationId}`);
    } else {
      navigate('/dashboard');
    }
  };
  
  return (
    <Container className="py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
          <CardDescription>
            Your premium valuation report is now available
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Thank you for your purchase. You now have full access to all premium features
            including detailed valuation breakdown, comparable listings, and dealer offers.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {isLoading && !verificationComplete ? (
            <Button disabled className="w-full sm:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying payment...
            </Button>
          ) : (
            <Button onClick={handleViewReport} className="w-full sm:w-auto">
              View Premium Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </Container>
  );
}
