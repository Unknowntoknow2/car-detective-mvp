
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Car } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LookupTabs } from '@/components/lookup/LookupTabs';
import { Toaster } from '@/components/ui/sonner';

const ValuationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    if (user) {
      navigate('/premium-valuation');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-center" richColors />
      <h1 className="text-3xl font-bold mb-6">Vehicle Valuation</h1>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Instant Vehicle Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LookupTabs defaultTab="vin" />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Award className="h-5 w-5" />
                Premium Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-amber-700">Unlock comprehensive reports, market analysis, and dealer offers with our premium valuation.</p>
              
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>Full CARFAX® Vehicle History Report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>Detailed market analysis with similar vehicles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>Connect with dealers for competitive offers</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handlePremiumClick}
                >
                  Get Premium Valuation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recently Valued Cars */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Valued</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Your recent valuations will appear here.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/dashboard">
                      View All Valuations
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Sign in to save and view your valuation history.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth">
                      Sign In
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ValuationPage;
