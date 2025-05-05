
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId || !user) {
      toast.error("Invalid or missing session information");
      navigate('/premium');
      return;
    }

    const verifyPayment = async () => {
      try {
        setIsLoading(true);
        console.log('Verifying payment for session:', sessionId);
        
        // Check if this order exists and is completed
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, valuations(*)')
          .eq('stripe_session_id', sessionId)
          .eq('user_id', user.id)
          .single();
          
        if (orderError) {
          console.error('Error fetching order:', orderError);
          toast.error('Could not verify your payment');
          navigate('/premium');
          return;
        }
        
        if (!orderData) {
          toast.error('Order not found');
          navigate('/premium');
          return;
        }
        
        setOrderDetails(orderData);
        
        // If order is not yet completed, update status
        // (This is a fallback in case the webhook failed)
        if (orderData.status !== 'completed') {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('stripe_session_id', sessionId)
            .eq('user_id', user.id);

          if (updateError) {
            console.error('Error updating order:', updateError);
            // Don't return, continue to check valuation status
          }
          
          // Also ensure the valuation is marked as premium
          if (orderData.valuation_id) {
            const { error: valuationError } = await supabase
              .from('valuations')
              .update({ premium_unlocked: true })
              .eq('id', orderData.valuation_id)
              .eq('user_id', user.id);
              
            if (valuationError) {
              console.error('Error updating valuation:', valuationError);
              // Continue anyway
            }
          }
        }
        
        toast.success('Your premium report is now available!');
      } catch (error) {
        console.error('Error processing payment confirmation:', error);
        toast.error('There was a problem confirming your payment');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Card className="max-w-lg mx-auto p-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">
            Payment Successful!
          </h1>
          <p className="text-slate-600">
            {orderDetails?.valuations ? 
              `Your Premium Report for ${orderDetails.valuations.year} ${orderDetails.valuations.make} ${orderDetails.valuations.model} is now available.` :
              'Thank you for purchasing Premium Valuation. Your report is now available.'
            }
          </p>
          <div className="pt-4 space-y-2">
            {orderDetails?.valuation_id && (
              <Button 
                onClick={() => navigate(`/valuations/${orderDetails.valuation_id}`)} 
                className="w-full"
              >
                View Your Report
              </Button>
            )}
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant={orderDetails?.valuation_id ? "outline" : "default"}
              className="w-full mt-2"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
