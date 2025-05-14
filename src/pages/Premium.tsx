
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Check } from 'lucide-react';

const Premium = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium Valuation Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get comprehensive vehicle valuations with detailed market analysis, CARFAX history, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium">
              Popular
            </div>
            <CardHeader>
              <CardTitle>Basic Valuation</CardTitle>
              <CardDescription>Free</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Basic vehicle value estimate</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Make, model, and year analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Simple condition assessment</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/valuation')} 
                variant="outline" 
                className="w-full"
              >
                Start Free Valuation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary shadow-lg relative transform scale-105">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium">
              Recommended
            </div>
            <CardHeader>
              <CardTitle>Premium Valuation</CardTitle>
              <CardDescription>$29.99 one-time</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Full CARFAX® Report ($44.99 value)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Comprehensive market analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Detailed condition assessment</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>12-month price forecast</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Downloadable PDF report</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/premium-valuation')} 
                className="w-full"
              >
                Get Premium Valuation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Dealer Connect</CardTitle>
              <CardDescription>Free with Premium</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Connect with local dealers</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Get competitive offers</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>No-hassle communication</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/premium-valuation')} 
                variant="outline" 
                className="w-full"
              >
                Included with Premium
                <Shield className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Quick Valuation Right Now?</h2>
          <p className="text-gray-600 mb-6">
            Get started with our free valuation tool and upgrade to premium at any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/valuation')}
              variant="outline"
            >
              Try Free Valuation
            </Button>
            <Button 
              onClick={() => navigate('/premium-valuation')}
            >
              Go Premium Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
