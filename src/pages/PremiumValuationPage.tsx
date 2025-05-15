
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, AlertCircle, ArrowRight, Upload, FileText, Building, BarChart4 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';

const PremiumValuationPage: React.FC = () => {
  const navigate = useNavigate();
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
              <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
              <p className="mb-6">Please sign in to access premium valuation features.</p>
              <Button onClick={() => navigate('/auth')}>
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
                    ${step > index ? 'bg-primary text-white border-primary' : 
                      step === index + 1 ? 'border-primary text-primary' : 'border-gray-300 text-gray-400'}`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div 
                    className={`h-1 flex-1 mx-2 ${step > index + 1 ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
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
              <CardDescription>Enter your vehicle's basic details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Premium Valuation Form</h3>
                  <p className="text-gray-500 mb-4">This is where the vehicle information form will be implemented.</p>
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
              <CardDescription>Assess your vehicle's condition accurately</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <BarChart4 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Condition Assessment</h3>
                  <p className="text-gray-500 mb-4">This is where the condition assessment form will be implemented.</p>
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
              <CardDescription>Select all features included in your vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <Check className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Feature Selection</h3>
                  <p className="text-gray-500 mb-4">This is where the feature selection form will be implemented.</p>
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
              <CardDescription>Upload photos to get a more accurate valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Photo Upload</h3>
                  <p className="text-gray-500 mb-4">This is where the photo upload form will be implemented.</p>
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
              <CardDescription>Review your information and submit for valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Review Summary</h3>
                  <p className="text-gray-500 mb-4">This is where the review summary will be displayed.</p>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success("Premium valuation submitted successfully!");
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
                <span>Comprehensive valuation with detailed market analysis</span>
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
                <span>Professional PDF report to share with buyers or insurance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PremiumValuationPage;
