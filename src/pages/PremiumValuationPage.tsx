<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
=======
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BarChart4,
  Building,
  Check,
  FileText,
  Upload,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "sonner";
import { PremiumValuationForm } from "@/components/premium/form/PremiumValuationForm";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function PremiumValuationPage() {
  const { id: valuationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [valuation, setValuation] = useState<any>(null);
  const [isLoadingValuation, setIsLoadingValuation] = useState(true);
  const { hasPremiumAccess, isLoading, creditsRemaining, usePremiumCredit } = usePremiumAccess(valuationId);
  
  useEffect(() => {
    const fetchValuation = async () => {
      if (!valuationId) return;
      
      try {
        setIsLoadingValuation(true);
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .maybeSingle();
          
        if (error) throw error;
        setValuation(data);
      } catch (error) {
        console.error('Error fetching valuation:', error);
        toast({
          title: "Error loading valuation",
          description: "Could not load valuation details.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingValuation(false);
      }
    };
    
    fetchValuation();
  }, [valuationId]);
  
  const handleUsePremiumCredit = async () => {
    if (!valuationId) return;
    
    const success = await usePremiumCredit(valuationId);
    
    if (success) {
      toast({
        title: "Premium access granted!",
        description: "You now have premium access to this valuation.",
        variant: "success",
      });
      // Reload the page to show premium content
      window.location.reload();
    } else {
      toast({
        title: "Error activating premium",
        description: creditsRemaining > 0 
          ? "Failed to use premium credit. Please try again." 
          : "You don't have any premium credits available.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading || isLoadingValuation) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </MainLayout>
    );
  }
  
  if (!valuation) {
    return (
      <MainLayout>
        <Container className="py-12">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Valuation Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find the valuation you're looking for.
                </p>
                <Button onClick={() => navigate('/')}>Return Home</Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </MainLayout>
    );
  }
  
  if (!hasPremiumAccess) {
    return (
      <MainLayout>
        <Container className="py-12">
          <Card>
            <CardHeader>
              <CardTitle>Premium Access Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                This valuation requires premium access. Unlock premium features to view detailed analysis and reports.
              </p>
              
              {creditsRemaining > 0 ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-md">
                    <p className="font-medium">
                      You have {creditsRemaining} premium credit{creditsRemaining !== 1 ? 's' : ''} available!
                    </p>
                  </div>
                  <Button onClick={handleUsePremiumCredit}>
                    Use 1 Credit to Unlock
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate(`/premium-checkout?id=${valuationId}`)}>
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </Container>
      </MainLayout>
    );
  }
  
  // Premium content display would go here
  return (
    <MainLayout>
      <Container className="py-12">
        <Card>
          <CardHeader>
            <CardTitle>Premium Valuation Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Premium content for valuation {valuation.id}</p>
            {/* Render premium valuation content here */}
=======
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Authentication Required
              </h2>
              <p className="mb-6">
                Please sign in to access premium valuation features.
              </p>
              <Button onClick={() => navigate("/auth")}>
                Sign In / Register
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Premium Valuation</h1>

        <div className="mb-8">
          <div className="flex items-center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                    ${
                    step > index
                      ? "bg-primary text-white border-primary"
                      : step === index + 1
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step > index + 1 ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-2 text-sm text-gray-600">
            <div>Vehicle Info</div>
            <div>Condition</div>
            <div>Features</div>
            <div>Photos</div>
            <div>Review</div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>
                Enter your vehicle's basic details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Premium Valuation Form
                  </h3>
                  <p className="text-gray-500 mb-4">
                    This is where the vehicle information form will be
                    implemented.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Condition</CardTitle>
              <CardDescription>
                Assess your vehicle's condition accurately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <BarChart4 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Condition Assessment
                  </h3>
                  <p className="text-gray-500 mb-4">
                    This is where the condition assessment form will be
                    implemented.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Features</CardTitle>
              <CardDescription>
                Select all features included in your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <Check className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Feature Selection
                  </h3>
                  <p className="text-gray-500 mb-4">
                    This is where the feature selection form will be
                    implemented.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Photos</CardTitle>
              <CardDescription>
                Upload photos to get a more accurate valuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Photo Upload</h3>
                  <p className="text-gray-500 mb-4">
                    This is where the photo upload form will be implemented.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review your information and submit for valuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Review Summary</h3>
                  <p className="text-gray-500 mb-4">
                    This is where the review summary will be displayed.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(
                        "Premium valuation submitted successfully!",
                      );
                      navigate("/my-valuations");
                    }}
                  >
                    Submit Valuation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 bg-primary/5 border border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Premium Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  Comprehensive valuation with detailed market analysis
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>CARFAX® Vehicle History Report included</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Connect with local dealers for competitive offers</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  Professional PDF report to share with buyers or insurance
                </span>
              </li>
            </ul>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}
