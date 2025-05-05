
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { FilePlus, ArrowRight, DownloadCloud, Link as LinkIcon, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NextStepsCardProps {
  valuationId?: string;
  canDownload?: boolean;
  onDownload?: () => void;
}

export function NextStepsCard({ valuationId, canDownload = false, onDownload }: NextStepsCardProps) {
  const { user } = useAuth();
  
  const handleReferralMarkEarned = async () => {
    if (user && valuationId) {
      try {
        // Mark referral as earned when user completes first valuation
        await supabase.functions.invoke('process-referral', {
          body: {
            action: 'mark-earned',
            userId: user.id,
            rewardType: 'valuation',
            rewardAmount: 5.00
          }
        });
      } catch (error) {
        console.error('Error marking referral earned:', error);
        // Don't show error to user
      }
    }
  };
  
  // When this component loads and there's a valuation, mark referral as earned
  React.useEffect(() => {
    if (user && valuationId) {
      handleReferralMarkEarned();
    }
  }, [user, valuationId]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
        <CardDescription>
          Get more from your Car Detective valuation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Premium Valuation</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Unlock dealer-grade valuation insights, market analysis, and price forecasts.
          </p>
          <Link to="/premium">
            <Button className="w-full flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Upgrade to Premium
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        </div>
        
        {canDownload && (
          <div>
            <h3 className="text-lg font-medium mb-2">Download Report</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Save your valuation report as a PDF for your records.
            </p>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={onDownload}
            >
              <DownloadCloud className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-2">Share with Friends</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Invite friends to Car Detective and earn rewards when they use the platform.
          </p>
          <Link to="/dashboard/referrals">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Refer Friends
            </Button>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          *All valuations are estimates based on current market data. Actual selling price may vary.
        </p>
      </CardFooter>
    </Card>
  );
}
