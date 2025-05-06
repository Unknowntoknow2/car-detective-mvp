
import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, FileText, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PremiumSuccessPage() {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const verifyPayment = async () => {
    try {
      setIsVerifying(true);
      // Get session ID from URL
      const searchParams = new URLSearchParams(location.search);
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError("Missing session information");
        toast.error("Missing session information");
        setIsVerifying(false);
        return;
      }
      
      // First check if the order exists and is marked as paid
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status, valuation_id')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();
      
      if (orderError) {
        console.error("Order verification error:", orderError);
        setError("Failed to verify order status");
        setIsVerifying(false);
        return;
      }
      
      if (!orderData) {
        // Order not found yet, which could happen if webhook hasn't processed
        if (retryCount < 3) {
          // Wait with exponential backoff and retry
          const timeout = Math.pow(2, retryCount) * 1000;
          console.log(`Order not found yet. Retrying in ${timeout/1000} seconds...`);
          setTimeout(() => {
            setRetryCount(prevCount => prevCount + 1);
            verifyPayment();
          }, timeout);
          return;
        } else {
          setError("Payment information not found. Please try refreshing.");
          setIsVerifying(false);
          return;
        }
      }
      
      setValuationId(orderData.valuation_id);
      setPaymentStatus(orderData.status);
      
      // Next, verify if the valuation is marked as premium_unlocked
      if (orderData.valuation_id) {
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('premium_unlocked')
          .eq('id', orderData.valuation_id)
          .maybeSingle();
        
        if (valuationError) {
          console.error("Valuation verification error:", valuationError);
          setError("Failed to verify premium access");
          setIsVerifying(false);
          return;
        }
        
        // Set verification success based on both order status and premium_unlocked flag
        const paymentSucceeded = orderData.status === 'paid' && valuationData?.premium_unlocked === true;
        
        if (paymentSucceeded) {
          setVerificationSuccess(true);
          toast.success("Payment confirmed! Premium features are now available.");
        } else {
          // Still processing or failed
          if (orderData.status === 'paid' && !valuationData?.premium_unlocked) {
            setError("Premium access is still being processed. Please try refreshing.");
          } else {
            setError(`Payment processing. Status: ${orderData.status}`);
          }
        }
      } else {
        setError("Missing valuation information");
      }
    } catch (error) {
      console.error("Error in payment verification:", error);
      setError("An unexpected error occurred while verifying your payment");
      toast.error("An unexpected error occurred");
    } finally {
      setIsVerifying(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      verifyPayment();
    } else {
      setError("You need to be logged in to verify payment");
      setIsVerifying(false);
    }
  }, [user]);
  
  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    verifyPayment();
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Helmet>
        <title>Payment Status - Car Detective</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-slate-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
              {isVerifying ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : verificationSuccess ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isVerifying ? "Verifying Payment..." : 
               verificationSuccess ? "Payment Successful!" : 
               "Payment Verification Issue"}
            </CardTitle>
            <CardDescription>
              {isVerifying 
                ? "Please wait while we verify your payment." 
                : verificationSuccess
                  ? "Your premium report is now available."
                  : "There was an issue with your payment verification."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!isVerifying && (
              <>
                {verificationSuccess ? (
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <p className="text-center text-sm">
                      Thank you for your purchase! Your premium valuation report has been unlocked with comprehensive details and insights.
                    </p>
                    {paymentStatus && (
                      <p className="text-center text-xs mt-2 text-gray-500">
                        Payment Status: {paymentStatus}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-center text-sm">
                      {paymentStatus === 'pending' 
                        ? "Your payment is being processed. This might take a moment."
                        : "There was an issue confirming your payment. If you believe this is an error, please contact support."}
                    </p>
                    {paymentStatus && (
                      <p className="text-center text-xs mt-2 text-gray-500">
                        Payment Status: {paymentStatus}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid gap-3">
                  {verificationSuccess && valuationId && (
                    <Button asChild>
                      <Link to={`/valuation/premium?id=${valuationId}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Premium Report
                      </Link>
                    </Button>
                  )}
                  
                  {!verificationSuccess && (
                    <Button variant="outline" onClick={handleRetry}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Verification
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
