
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default function ValuationResultLayout() {
  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Valuation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Vehicle Valuation Complete</h2>
                <p className="text-muted-foreground">
                  Your vehicle valuation has been processed successfully.
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Estimated Value</h3>
                  <p className="text-3xl font-bold text-primary">$25,000</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Confidence Score</h3>
                  <p className="text-xl font-semibold">85%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Vehicle Details</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Make:</span>
                    <span>Toyota</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span>Test Vehicle</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span>2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mileage:</span>
                    <span>50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <span>Good</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
