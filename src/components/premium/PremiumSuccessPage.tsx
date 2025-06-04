<<<<<<< HEAD

// Add a check to handle undefined values before using the valuationId
// This is a partial fix assuming the component exists
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
=======
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { verifyPaymentStatus } from "@/utils/premiumService";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const PremiumSuccessPage = () => {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();
<<<<<<< HEAD

  // Navigation handlers
  const handleViewValuation = () => {
    if (valuationId) {
      navigate(`/valuation/${valuationId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGetDealerOffers = () => {
    if (valuationId) {
      navigate(`/dealer-offers/${valuationId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Premium Upgrade Successful!</h1>
        <p className="text-lg mb-8">
          You now have access to premium features including detailed valuation analytics,
          dealer offers, and comprehensive vehicle history reports.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleViewValuation} size="lg">
            View Enhanced Valuation
          </Button>
          <Button onClick={handleGetDealerOffers} variant="outline" size="lg">
            Get Dealer Offers
          </Button>
        </div>
      </div>
=======
  const sessionId = searchParams.get("session_id");
  const valuationId = searchParams.get("valuation_id");
  const [verifying, setVerifying] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    // Redirect if no session ID or valuation ID
    if (!sessionId || !valuationId) {
      toast.error("Invalid payment session");
      navigate("/");
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
            toast.success(
              "Payment confirmed! Premium features are now available.",
            );
          } else {
            // Payment exists but isn't completed yet
            toast.info(
              "Your payment is being processed. Premium features will be available shortly.",
            );
          }
        } else {
          toast.error(
            "Unable to verify payment status. Please contact support.",
          );
        }
      } catch (err) {
        console.error("Error verifying payment status:", err);
        toast.error(
          "Failed to verify payment. Please contact support if premium features are not available.",
        );
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
            {verifying
              ? <Loader2 className="h-8 w-8 text-primary animate-spin" />
              : <CheckCircle className="h-8 w-8 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {verifying
              ? "Verifying Payment..."
              : paymentConfirmed
              ? "Payment Successful!"
              : "Payment Processing"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {verifying
                ? "Please wait while we verify your payment..."
                : paymentConfirmed
                ? "Thank you for your purchase. Your premium valuation report is now ready."
                : "Your payment is being processed. Premium features will be available shortly."}
            </p>

            <div className="grid gap-4 mt-8">
              {!verifying && (
                <>
                  <Button asChild size="lg">
                    <Link
                      to={`/valuation/${valuationId}${
                        paymentConfirmed ? "/premium" : ""
                      }`}
                    >
                      {paymentConfirmed
                        ? "View Premium Report"
                        : "View Valuation"}{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                If you have any questions or need assistance, please contact our
                support team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </div>
  );
};

export default PremiumSuccessPage;
