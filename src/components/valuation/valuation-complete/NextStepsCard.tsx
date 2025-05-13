
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Share2, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface NextStepsCardProps {
  valuationId?: string;
  isPremium?: boolean;
  onShareClick?: () => void;
  onDownloadClick?: () => void;
}

export function NextStepsCard({ 
  valuationId, 
  isPremium = false,
  onShareClick,
  onDownloadClick
}: NextStepsCardProps) {
  const navigate = useNavigate();

  const handleShareClick = () => {
    if (onShareClick) {
      onShareClick();
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: 'My Car Valuation',
          text: 'Check out the valuation for my car!',
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  };

  const handleDownloadClick = () => {
    if (onDownloadClick) {
      onDownloadClick();
    } else if (isPremium) {
      // Default premium download behavior
      navigate(`/download-report?valuationId=${valuationId}`);
    } else {
      // Prompt to upgrade
      navigate(`/premium?valuationId=${valuationId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
              Share Valuation
            </Button>
            
            <Button 
              variant={isPremium ? "default" : "outline"}
              className="flex items-center justify-center gap-2"
              onClick={handleDownloadClick}
            >
              <FileDown className="h-4 w-4" />
              {isPremium ? "Download PDF Report" : "Upgrade to Download"}
            </Button>
          </div>
          
          {!isPremium && (
            <Button 
              variant="default" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate(`/premium?valuationId=${valuationId}`)}
            >
              <Car className="h-4 w-4" />
              Get Premium Valuation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
