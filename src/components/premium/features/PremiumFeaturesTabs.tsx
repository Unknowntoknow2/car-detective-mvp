
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumFeaturesTabsProps {
  className?: string;
}

export function PremiumFeaturesTabs({ className }: PremiumFeaturesTabsProps) {
  return (
    <div className={className}>
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Premium Features</h3>
              <ul className="space-y-2">
                <li>• Detailed market analysis</li>
                <li>• Professional vehicle reports</li>
                <li>• Advanced condition assessment</li>
                <li>• Dealer network access</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Free vs Premium</h3>
              <p>Compare the features available in our free and premium tiers.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="benefits">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Premium Benefits</h3>
              <p>Discover how premium features can save you time and money.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
