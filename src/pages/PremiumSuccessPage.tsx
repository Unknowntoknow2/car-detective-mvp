
import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, FileText, RefreshCw, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PremiumSuccessPage() {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('PREMIUM SUCCESS: Page loaded');
    const sessionId = searchParams.get('session_id');
    const valId = searchParams.get('valuation_id');
    console.log('PREMIUM SUCCESS: URL parameters:', { sessionId, valuationId: valId });
  }, [searchParams]);
  
  const verifyPayment = async () => {
    try {
      console.log('PREMIUM SUCCESS: Verifying payment...');
      setIsVerifying(true);
      // Get session ID from URL
      const sessionId = searchParams.get('session_id');
      const valId = searchParams.get('valuation_id');
      
      if (!sessionId) {
        console.error('PREMIUM SUCCESS: Missing session_id parameter');
        setError("Missing payment session information");
        toast.error("Missing payment information");
        setIsVerifying(false);
        return;
      }
      
      // First, check if the order exists and is confirmed paid in the database
      console.log('PREMIUM SUCCESS: Checking order status in database');
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status, valuation_id, updated_at')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();
      
      if (orderError) {
        console.error("PREMIUM SUCCESS: Error checking order status:", orderError);
        setError(`Error verifying payment: ${orderError.message}`);
        setIsVerifying(false);
        return;
      }
      
      // If order exists, use that data
      if (orderData) {
        console.log('PREMIUM SUCCESS: Order found in database:', orderData);
        setPaymentStatus(orderData.status);
        setValuationId(orderData.valuation_id);
        
        // If order is marked as paid, check the valuation premium_unlocked status
        if (orderData.status === 'paid') {
          console.log('PREMIUM SUCCESS: Order is marked as paid, checking premium_unlocked status');
          const { data: valData, error: valError } = await supabase
            .from('valuations')
            .select('premium_unlocked')
            .eq('id', orderData.valuation_id)
            .maybeSingle();
          
          if (valError) {
            console.error("PREMIUM SUCCESS: Error checking valuation premium status:", valError);
          } else if (valData) {
            console.log('PREMIUM SUCCESS: Valuation data:', valData);
            // Payment confirmed and premium unlocked, show success
            if (valData.premium_unlocked) {
              console.log('PREMIUM SUCCESS: Premium is unlocked, showing success');
              setVerificationSuccess(true);
              toast.success("Premium access confirmed!");
            } else {
              console.log('PREMIUM SUCCESS: Payment confirmed but premium not unlocked yet, forcing update');
              // Payment confirmed but premium not unlocked yet (webhook might be delayed)
              setIsProcessing(true);
              // Call verify-payment edge function to force an update 
              await verifyWithEdgeFunction(sessionId, orderData.valuation_id);
            }
          }
        } else if (orderData.status === 'pending') {
          console.log('PREMIUM SUCCESS: Payment is still processing, checking with edge function');
          // Payment is still processing, let's double-check with the edge function
          setIsProcessing(true);
          await verifyWithEdgeFunction(sessionId, orderData.valuation_id);
        } else {
          // Failed or other status
          console.warn(`PREMIUM SUCCESS: Payment unsuccessful, status: ${orderData.status}`);
          setError(`Payment was not successful. Status: ${orderData.status}`);
        }
      } else {
        // No order found in database, use the edge function to verify with Stripe API
        console.log("PREMIUM SUCCESS: No order found in database, verifying with Stripe");
        await verifyWithEdgeFunction(sessionId, valId);
      }
    } catch (error) {
      console.error("PREMIUM SUCCESS: Error in payment verification:", error);
      setError("An unexpected error occurred while verifying your payment");
      toast.error("An unexpected error occurred");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const verifyWithEdgeFunction = async (sessionId: string, valId: string | null = null) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId, valuationId: valId }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        setError(`Verification failed: ${error.message}`);
        return;
      }
      
      if (data.paymentSucceeded) {
        setVerificationSuccess(true);
        setPaymentStatus('paid');
        if (data.valuation_id) {
          setValuationId(data.valuation_id);
        }
        toast.success("Payment confirmed! Premium features are now available.");
      } else if (data.status === 'pending') {
        // Still processing
        setIsProcessing(true);
        setPaymentStatus('pending');
        setError("Your payment is being processed. This may take a moment.");
        
        // Retry after a delay if we haven't retried too many times
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prevCount => prevCount + 1);
            verifyWithEdgeFunction(sessionId, valId);
          }, 3000 * (retryCount + 1)); // Exponential backoff
        }
      } else {
        setPaymentStatus(data.status || 'failed');
        setError("Payment verification failed. Please contact support if you believe this is an error.");
      }
    } catch (e) {
      console.error("Error invoking verify-payment function:", e);
      setError("Failed to verify payment status");
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
    setIsVerifying(true);
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
              ) : isProcessing ? (
                <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
              ) : verificationSuccess ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isVerifying ? "Verifying Payment..." : 
               isProcessing ? "Payment Processing..." :
               verificationSuccess ? "Payment Successful!" : 
               "Payment Verification Issue"}
            </CardTitle>
            <CardDescription>
              {isVerifying 
                ? "Please wait while we verify your payment." 
                : isProcessing
                  ? "Your payment is being processed by our payment provider."
                  : verificationSuccess
                    ? "Your premium report is now available."
                    : "There was an issue with your payment verification."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant={isProcessing ? "default" : "destructive"}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!isVerifying && (
              <>
                {(verificationSuccess || isProcessing) ? (
                  <div className={`rounded-lg p-4 border ${verificationSuccess ? 'bg-primary/5 border-primary/20' : 'bg-amber-50 border-amber-200'}`}>
                    <p className="text-center text-sm">
                      {verificationSuccess 
                        ? "Thank you for your purchase! Your premium valuation report has been unlocked with comprehensive details and insights."
                        : "Your payment is being processed by our payment provider. This might take a few moments. You can safely leave this page and check back later."}
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
                  
                  {!verificationSuccess && !isProcessing && (
                    <Button variant="outline" onClick={handleRetry} disabled={isVerifying}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
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
