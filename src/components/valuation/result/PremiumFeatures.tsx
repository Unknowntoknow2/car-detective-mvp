
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, FileText, BarChart, CarFront, Activity } from 'lucide-react';

export interface PremiumFeaturesProps {
  onUpgrade: () => void;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ onUpgrade }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Lock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Unlock Premium Features</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Detailed PDF Report</p>
            <p className="text-sm text-muted-foreground">
              Get a comprehensive report with all valuation details.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <BarChart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Market Analysis</p>
            <p className="text-sm text-muted-foreground">
              See price trends and market demand in your area.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <CarFront className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">CARFAX Integration</p>
            <p className="text-sm text-muted-foreground">
              View vehicle history and accident reports.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Activity className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Value Adjustments</p>
            <p className="text-sm text-muted-foreground">
              Fine-tune your valuation with custom options.
            </p>
          </div>
        </div>
      </div>
      
      <Button onClick={onUpgrade} className="w-full">
        Upgrade to Premium
      </Button>
    </div>
  );
};
