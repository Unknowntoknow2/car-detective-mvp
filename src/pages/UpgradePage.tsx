
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UpgradePage() {
  const navigate = useNavigate();
  
  const handlePurchase = () => {
    navigate('/premium-success');
  };
  
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upgrade Your Experience</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Plan</CardTitle>
                <CardDescription>Free</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Basic vehicle valuations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>VIN lookup</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Simple valuation reports</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary shadow-md">
              <CardHeader className="bg-primary text-white">
                <div className="flex justify-between items-center">
                  <CardTitle>Premium Plan</CardTitle>
                  <div className="px-2 py-1 bg-white text-primary text-xs font-bold rounded">
                    RECOMMENDED
                  </div>
                </div>
                <CardDescription className="text-white opacity-90">
                  $29.99 one-time payment
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>All Basic features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Detailed market analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>CARFAX® vehicle history reports</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Comprehensive PDF reports</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>12-month price forecast</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Dealer-competitive offers</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full" onClick={handlePurchase}>
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">How does the premium valuation differ from the basic one?</h3>
                <p className="text-muted-foreground">
                  Premium valuations include detailed market analysis, comparisons with similar vehicles, CARFAX® history reports, and more accurate pricing data from multiple sources.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Is this a subscription or a one-time payment?</h3>
                <p className="text-muted-foreground">
                  The premium plan is a one-time payment that gives you access to premium features for the current vehicle valuation. Each new valuation requires a separate premium purchase.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Can I upgrade later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can start with the basic valuation and upgrade to premium at any time to access additional features and insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
