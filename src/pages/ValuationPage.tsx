import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ValuationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vehicle Valuation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Get Your Vehicle's Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Enter your vehicle details to get an accurate valuation.</p>
          
          <div className="p-4 bg-muted rounded-md">
            <p className="text-center text-muted-foreground">Valuation form will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuationPage;
