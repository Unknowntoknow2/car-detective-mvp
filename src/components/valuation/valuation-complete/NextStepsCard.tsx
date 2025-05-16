
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck, FileText, Share2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface NextStepsCardProps {
  isPremium?: boolean;
  valuationId: string;
  onShareClick?: () => void;
}

export function NextStepsCard({ isPremium = false, valuationId, onShareClick }: NextStepsCardProps) {
  const handleShareClick = () => {
    if (onShareClick) {
      onShareClick();
    } else {
      // Copy share link to clipboard
      const shareLink = `${window.location.origin}/valuation/${valuationId}`;
      navigator.clipboard.writeText(shareLink);
      toast.success("Share link copied to clipboard");
    }
  };

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
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Link>
              </Button>
            </div>
          )}
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">What would you like to do?</h3>
            
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={handleShareClick}
            >
              <div className="flex items-center">
                <Share2 className="h-4 w-4 mr-2 text-blue-600" />
                <span>Share this valuation</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between"
              asChild
            >
              <Link to={`/valuation/${valuationId}`}>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  <span>View full valuation report</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between"
              asChild
            >
              <Link to="/valuation">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span>Start a new valuation</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            {isPremium && (
              <Button 
                variant="outline" 
                className="w-full justify-between"
                asChild
              >
                <Link to="/my-valuations">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
                    <span>View saved valuations</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NextStepsCard;
