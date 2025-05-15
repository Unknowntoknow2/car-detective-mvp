
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
      <h1 className="text-3xl font-bold mb-6">Vehicle Valuation</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free Basic Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get a quick estimate of your vehicle's value with basic information.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-center text-muted-foreground">Basic valuation form will be implemented here.</p>
              </div>
              
              <Button asChild className="w-full">
                <Link to="/valuation/basic">
                  Start Free Valuation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
};

export default ValuationPage;
