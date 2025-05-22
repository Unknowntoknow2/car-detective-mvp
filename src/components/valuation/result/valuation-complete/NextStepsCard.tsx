
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, Download, Mail } from 'lucide-react';

interface NextStepsCardProps {
  valuationId: string;
  onShareClick?: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export const NextStepsCard: React.FC<NextStepsCardProps> = ({
  valuationId,
  onShareClick,
  isPremium = false,
  onUpgrade
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={onShareClick}>
              <Share className="h-4 w-4" />
              Share
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Report
            </Button>
          </div>
          
          {!isPremium && onUpgrade && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <h3 className="font-semibold text-amber-700">Unlock Premium Features</h3>
              <p className="text-sm text-amber-600 mb-2">
                Get detailed market analysis, trade-in values, and dealer offers.
              </p>
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600"
                onClick={onUpgrade}
              >
                Upgrade to Premium
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;
