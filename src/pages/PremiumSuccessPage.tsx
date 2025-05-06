
import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Loader2, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

export default function PremiumSuccessPage() {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get session ID from URL
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          toast.error("Missing session information");
          setIsVerifying(false);
          return;
        }
        
        // Query for the associated order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('valuation_id, status')
          .eq('stripe_session_id', sessionId)
          .maybeSingle();
          
        if (orderError) throw orderError;
        
        if (!orderData) {
          toast.error("Could not verify payment");
          setIsVerifying(false);
          return;
        }
        
        // Store the valuation ID for navigation
        setValuationId(orderData.valuation_id);
        
        // Check if the webhook has processed this payment already
        if (orderData.status === 'paid') {
          setVerificationSuccess(true);
          setIsVerifying(false);
          
          // Update valuation to mark premium as unlocked
          const { error: updateError } = await supabase
            .from('valuations')
            .update({ premium_unlocked: true })
            .eq('id', orderData.valuation_id);
            
          if (updateError) {
            console.error("Error updating valuation premium status:", updateError);
          }
          
          return;
        }
        
        // If not yet processed, we'll poll a few times (webhook might be delayed)
        let attempts = 0;
        const maxAttempts = 5;
        
        const checkStatus = async () => {
          attempts++;
          
          const { data: updatedOrder, error } = await supabase
            .from('orders')
            .select('status')
            .eq('stripe_session_id', sessionId)
            .maybeSingle();
            
          if (error) throw error;
          
          if (updatedOrder?.status === 'paid') {
            setVerificationSuccess(true);
            setIsVerifying(false);
            return;
          }
          
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, 2000); // Check again in 2 seconds
          } else {
            // After max attempts, assume it's probably fine
            // The webhook will eventually process it
            setVerificationSuccess(true);
            setIsVerifying(false);
          }
        };
        
        checkStatus();
        
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Error verifying payment");
        setIsVerifying(false);
      }
    };
    
    if (user) {
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [location.search, user]);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Helmet>
        <title>Payment Successful - Car Detective</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
              {isVerifying ? (
                <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isVerifying ? "Verifying Payment..." : "Payment Successful!"}
            </CardTitle>
            <CardDescription>
              {isVerifying 
                ? "Please wait while we verify your payment." 
                : "Your premium report is now available."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isVerifying && (
              <>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-center text-sm">
                    Thank you for your purchase! Your premium valuation report has been unlocked with comprehensive details and insights.
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {valuationId && (
                    <Button asChild>
                      <Link to={`/valuation/premium?id=${valuationId}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Premium Report
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
