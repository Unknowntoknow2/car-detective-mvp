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
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId || !user) {
      toast.error("Invalid or missing session information");
      navigate('/premium');
      return;
    }

    const updateOrderStatus = async () => {
      try {
        console.log('Updating order status for session:', sessionId);
        
        const { data: existingOrders, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .eq('status', 'completed');
          
        if (fetchError) {
          console.error('Error checking order status:', fetchError);
          throw new Error('Could not verify order status');
        }
        
        if (existingOrders && existingOrders.length > 0) {
          console.log('Order already marked as completed');
          setIsLoading(false);
          return;
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('stripe_session_id', sessionId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating order:', updateError);
          throw updateError;
        }
        
        toast.success('Your premium valuation has been activated!');
      } catch (error) {
        console.error('Error processing payment confirmation:', error);
        toast.error('There was a problem confirming your payment');
      } finally {
        setIsLoading(false);
      }
    };

    updateOrderStatus();
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
            Thank you for purchasing Premium Valuation. Your report is now being prepared.
          </p>
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/premium')} 
              variant="outline"
              className="w-full mt-2"
            >
              View Premium Features
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
