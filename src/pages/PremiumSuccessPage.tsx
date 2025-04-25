
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

export default function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (!sessionId) {
        navigate('/premium');
        return;
      }

      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('stripe_session_id', sessionId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    updateOrderStatus();
  }, [sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/valuation/premium')} 
              className="w-full"
            >
              View Your Premium Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
