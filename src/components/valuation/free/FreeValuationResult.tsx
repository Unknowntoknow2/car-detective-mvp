
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { ConditionSliderWithTooltip } from '../ConditionSliderWithTooltip';
import { toast } from 'sonner';

interface FreeValuationResultProps {
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
  estimatedValue?: number;
  onUpgradeToPremium?: () => void;
}

const FreeValuationResult: React.FC<FreeValuationResultProps> = ({
  vehicleInfo = {
    make: 'Toyota',
    model: 'Camry',
    year: 2018,
    mileage: 45000,
    condition: 'Good'
  },
  estimatedValue = 18500,
  onUpgradeToPremium = () => {}
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Valuation Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </h2>
              <p className="text-muted-foreground">
                {vehicleInfo.mileage.toLocaleString()} miles • {vehicleInfo.condition} condition
              </p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
              <p className="text-sm text-muted-foreground mt-1">Based on current market conditions</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Condition Assessment</h3>
              <ConditionSliderWithTooltip 
                score={vehicleInfo.condition === 'Excellent' ? 90 : 
                       vehicleInfo.condition === 'Good' ? 75 :
                       vehicleInfo.condition === 'Fair' ? 50 : 25}
                onScoreChange={(score) => {
                  toast.info(`Condition updated. This would recalculate the valuation in a real implementation.`);
                }}
              />
            </div>
            
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  toast.success("Generating basic report...");
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Basic Report
                </Button>
                <Button onClick={onUpgradeToPremium}>
                  Premium Report
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upgrade to Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Get access to detailed market analysis, CARFAX history, and AI-powered condition assessment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <h3 className="font-medium">Free</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>✓ Basic valuation</li>
                <li>✓ Simple condition input</li>
                <li>✓ Basic PDF report</li>
                <li className="text-muted-foreground">✗ No CARFAX integration</li>
                <li className="text-muted-foreground">✗ No AI price explanation</li>
              </ul>
            </div>
            <div className="border border-primary bg-primary/5 rounded-md p-3">
              <h3 className="font-medium text-primary">Premium</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>✓ Everything in Free</li>
                <li>✓ CARFAX history integration</li>
                <li>✓ AI-powered price explanation</li>
                <li>✓ Detailed condition assessment</li>
                <li>✓ Dealer offer connections</li>
              </ul>
              <Button size="sm" className="mt-3 w-full" onClick={onUpgradeToPremium}>
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeValuationResult;
