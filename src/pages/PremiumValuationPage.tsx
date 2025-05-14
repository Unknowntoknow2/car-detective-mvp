
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';

const PremiumValuationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const valuationId = searchParams.get('id');
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Premium Valuation</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enhanced Vehicle Valuation</CardTitle>
            <CardDescription>
              Get a comprehensive market analysis and detailed report for your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 p-4 rounded-md mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-primary h-5 w-5 mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary">Premium Valuation Package</h3>
                  <p className="text-sm text-gray-600">
                    Unlock detailed insights, CARFAX history report, and dealer offers for just $29.99
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3">What's included:</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Full CARFAX® Vehicle History Report ($44.99 value)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Comprehensive market analysis with comparable listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Detailed condition assessment with AI-powered scoring</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>12-month price forecast and depreciation analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Professional PDF report for dealers and insurance</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Connect with local dealers for competitive offers</span>
              </li>
            </ul>
            
            <div className="flex justify-between items-center p-4 border rounded-md bg-gray-50 mb-6">
              <div>
                <span className="text-sm text-gray-500">One-time payment</span>
                <div className="text-2xl font-bold">$29.99</div>
              </div>
              <Button 
                size="lg"
                onClick={() => {
                  // In a real implementation, this would use the premiumService
                  // to initiate the checkout flow with the valuationId
                  if (valuationId) {
                    console.log(`Starting premium checkout for valuation: ${valuationId}`);
                    // This would call createCheckoutSession(valuationId)
                  } else {
                    console.log('Starting premium valuation without existing valuation');
                  }
                  // For now, just navigate to a placeholder page
                  navigate('/valuation');
                }}
              >
                Get Premium Report <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              Need to create a valuation first? <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/valuation')}>Start with a free valuation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PremiumValuationPage;
