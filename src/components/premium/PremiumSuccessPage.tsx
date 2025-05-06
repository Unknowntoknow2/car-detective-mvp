
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { verifyPaymentStatus } from '@/utils/premiumService';

export function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const valuationId = searchParams.get('valuation_id');
  const [verifying, setVerifying] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  useEffect(() => {
    // Redirect if no session ID or valuation ID
    if (!sessionId || !valuationId) {
      toast.error('Invalid payment session');
      navigate('/');
      return;
    }
    
    // Check payment status
    async function verifyPayment() {
      try {
        setVerifying(true);
        
        const result = await verifyPaymentStatus(sessionId, valuationId);
        
        if (result.success) {
          setPaymentConfirmed(result.paymentConfirmed);
          
          if (result.paymentConfirmed) {
            toast.success('Payment confirmed! Premium features are now available.');
          } else {
            // Payment exists but isn't completed yet
            toast.info('Your payment is being processed. Premium features will be available shortly.');
          }
        } else {
          toast.error('Unable to verify payment status. Please contact support.');
        }
      } catch (err) {
        console.error('Error verifying payment status:', err);
        toast.error('Failed to verify payment. Please contact support if premium features are not available.');
      } finally {
        setVerifying(false);
      }
    }
    
    verifyPayment();
  }, [sessionId, valuationId, navigate]);
  
  return (
    <div className="container max-w-3xl py-12">
      <Card className="border-primary/20">
        <CardHeader className="text-center pb-4 border-b">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-flex">
            {verifying ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <CheckCircle className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {verifying ? 'Verifying Payment...' : 
             paymentConfirmed ? 'Payment Successful!' : 
             'Payment Processing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {verifying ? 'Please wait while we verify your payment...' :
               paymentConfirmed ? 'Thank you for your purchase. Your premium valuation report is now ready.' :
               'Your payment is being processed. Premium features will be available shortly.'}
            </p>
            
            <div className="grid gap-4 mt-8">
              {!verifying && (
                <>
                  <Button asChild size="lg">
                    <Link to={`/valuation/${valuationId}${paymentConfirmed ? '/premium' : ''}`}>
                      {paymentConfirmed ? 'View Premium Report' : 'View Valuation'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="text-xs text-center text-muted-foreground mt-6">
              <p>Transaction ID: {sessionId?.substring(0, 8)}...</p>
              <p className="mt-1">
                If you have any questions or need assistance, please contact our support team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
