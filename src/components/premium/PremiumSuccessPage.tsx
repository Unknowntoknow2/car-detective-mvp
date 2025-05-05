
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const valuationId = searchParams.get('valuation_id');
  
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
        // Check the order status in the database
        const { data, error } = await supabase
          .from('orders')
          .select('status')
          .eq('stripe_session_id', sessionId)
          .eq('valuation_id', valuationId)
          .maybeSingle();
          
        if (error) {
          console.error('Error verifying payment:', error);
          return;
        }
        
        // If order exists and is completed, show success message
        if (data && data.status === 'completed') {
          toast.success('Payment confirmed! Premium features are now available.');
        } else {
          // Order exists but isn't completed yet, let the user know it's processing
          toast.info('Your payment is being processed. Premium features will be available shortly.');
        }
      } catch (err) {
        console.error('Error verifying payment status:', err);
      }
    }
    
    verifyPayment();
  }, [sessionId, valuationId, navigate]);
  
  return (
    <div className="container max-w-3xl py-12">
      <Card className="border-primary/20">
        <CardHeader className="text-center pb-4 border-b">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full inline-flex">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Thank you for your purchase. Your premium valuation report is now ready.
            </p>
            
            <div className="grid gap-4 mt-8">
              <Button asChild size="lg">
                <Link to={`/valuation/premium?id=${valuationId}`}>
                  View Premium Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
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
