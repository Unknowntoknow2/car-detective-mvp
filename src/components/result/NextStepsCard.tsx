
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const NextStepsCard: React.FC = () => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>What's Next?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Premium Report</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get a detailed valuation report with CARFAX history and more accurate pricing.
          </p>
          <Link to="/premium">
            <Button variant="default" size="sm" className="mt-2 w-full">
              Get Premium Valuation
            </Button>
          </Link>
        </div>
        
        <div>
          <h3 className="font-medium">Current Offers</h3>
          <p className="text-sm text-muted-foreground mt-1">
            View current offers from dealers in your area.
          </p>
          <Link to="/offers">
            <Button variant="outline" size="sm" className="mt-2 w-full">
              View Offers
            </Button>
          </Link>
        </div>
        
        <div>
          <h3 className="font-medium">Save This Valuation</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create an account to save and track your valuations over time.
          </p>
          <Link to="/register">
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
