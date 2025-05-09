
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface NextStepsCardProps {
  isPremium?: boolean;
  valuationId: string;
}

export function NextStepsCard({ isPremium = false, valuationId }: NextStepsCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isPremium && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md space-y-3">
              <div className="flex gap-2 items-start">
                <ShieldCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Unlock Premium Report</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Get CARFAX history, market analytics, and more detailed valuation.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                asChild
              >
                <Link to={`/premium?valuationId=${valuationId}`}>
                  Upgrade to Premium
                </Link>
              </Button>
            </div>
          )}
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">What would you like to do?</h3>
            
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Compare similar listings</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </div>
            
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm">Generate a detailed report</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </div>
            
            <Button variant="outline" className="w-full" asChild>
              <Link to="/valuation">
                Start a New Valuation
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NextStepsCard;
