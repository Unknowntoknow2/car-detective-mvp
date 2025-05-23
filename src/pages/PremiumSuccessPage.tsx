
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileDown, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PremiumSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { valuationId } = useParams<{ valuationId?: string }>();
  
  useEffect(() => {
    // In a real app, this would verify the payment was successful
    const verifyPurchase = async () => {
      // Simulating verification
      console.log('Verifying premium purchase...');
      
      // Set premium status in localStorage for demo purposes
      localStorage.setItem('premium_purchased', 'true');
    };
    
    verifyPurchase();
  }, []);
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Premium Purchase Successful!</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Thank you for upgrading to our Premium Valuation Package.
          </p>
          
          <Card className="mb-8 text-left">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-1 rounded-full">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Complete Your Valuation</p>
                    <p className="text-sm text-muted-foreground">Return to your valuation to access premium features and insights.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-1 rounded-full">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Download Your Report</p>
                    <p className="text-sm text-muted-foreground">Get a comprehensive PDF report with detailed valuation analysis.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-1 rounded-full">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Access Market Insights</p>
                    <p className="text-sm text-muted-foreground">Explore detailed market trends and comparable vehicle data.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            
            <Button size="lg" onClick={() => {
              if (valuationId) {
                navigate(`/premium-results/${valuationId}`);
              } else {
                navigate(-1);
              }
            }}>
              {valuationId ? "View Valuation Results" : "Return to Valuation"}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PremiumSuccessPage;
