
import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, FileText } from "lucide-react";
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
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get session ID from URL
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setError("Missing session information");
          toast.error("Missing session information");
          setIsVerifying(false);
          return;
        }
        
        // Verify the payment status using our edge function
        const { data, error: verifyError } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });
        
        if (verifyError) {
          console.error("Payment verification error:", verifyError);
          setError("Failed to verify payment status");
          toast.error("Failed to verify payment status");
          setIsVerifying(false);
          return;
        }
        
        if (!data.success) {
          setError(data.error || "Payment verification failed");
          toast.error(data.error || "Payment verification failed");
          setIsVerifying(false);
          return;
        }
        
        // Store the valuation ID and payment status
        setValuationId(data.valuationId);
        setPaymentStatus(data.paymentStatus);
        
        // Set verification status based on payment success
        if (data.paymentSucceeded) {
          setVerificationSuccess(true);
          toast.success("Payment confirmed! Premium features are now available.");
        } else {
          setError(`Payment not completed. Status: ${data.paymentStatus}`);
          toast.error("Payment has not been completed");
        }
        
        setIsVerifying(false);
      } catch (error) {
        console.error("Error in payment verification:", error);
        setError("An unexpected error occurred while verifying your payment");
        toast.error("An unexpected error occurred");
        setIsVerifying(false);
      }
    };
    
    if (user) {
      verifyPayment();
    } else {
      setError("You need to be logged in to verify payment");
      setIsVerifying(false);
    }
  }, [location.search, user]);
  
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
                      There was an issue confirming your payment. If you believe this is an error, please contact support.
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
                    <Button variant="outline" asChild onClick={() => window.location.reload()}>
                      <div>
                        Retry Verification
                      </div>
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
