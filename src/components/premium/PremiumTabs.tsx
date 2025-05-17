import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PremiumTabsProps {
  showFreeValuation?: boolean;
  onSubmit?: (type: string, value: string, state?: string, data?: any) => void;
}

export function PremiumTabs({ showFreeValuation = false, onSubmit }: PremiumTabsProps) {
  const navigate = useNavigate();
  
  const handlePremiumButtonClick = () => {
    if (onSubmit) {
      // If onSubmit is provided, call it
      onSubmit('premium', 'premium-valuation', undefined, undefined);
    } else {
      // Otherwise use the original scrolling behavior
      document.getElementById('premium-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Tabs defaultValue="premium" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-auto p-1">
        {showFreeValuation && (
          <TabsTrigger value="free" className="py-3">
            Free Valuation
          </TabsTrigger>
        )}
        <TabsTrigger value="premium" className="py-3 relative">
          Premium Valuation
          <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
            $29.99
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      {showFreeValuation && (
        <TabsContent value="free" className="mt-6 p-6 border rounded-lg">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Valuation</h3>
            <p className="text-muted-foreground">
              Get a quick estimate of your vehicle's value with our free basic valuation tool.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-gray-100 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span className="ml-2">Basic vehicle valuation</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-100 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span className="ml-2">Simple condition assessment</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-100 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span className="ml-2">Regional market adjustments</span>
              </li>
            </ul>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/valuation')}
            >
              Start Free Valuation
            </Button>
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="premium" className="mt-6 p-6 border border-amber-200 bg-amber-50 rounded-lg">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-amber-800">Premium Valuation</h3>
          <p className="text-amber-700">
            Get the most accurate and comprehensive valuation with our premium service.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span className="ml-2">Full CARFAX® Vehicle History Report ($44 value)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span className="ml-2">Detailed market analysis with similar vehicles</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span className="ml-2">Connect with dealers for competitive offers</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span className="ml-2">12-month value prediction forecast</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span className="ml-2">Professional PDF export for sharing</span>
            </li>
          </ul>
          <Button 
            className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handlePremiumButtonClick}
          >
            Get Premium Valuation ($29.99)
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
