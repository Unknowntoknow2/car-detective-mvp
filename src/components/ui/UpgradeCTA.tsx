// Upgrade CTA Component - Prompts users to upgrade to premium
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, FileText, Share2, BarChart3, Zap } from 'lucide-react';

interface UpgradeCTAProps {
  feature?: string;
  className?: string;
}

export function UpgradeCTA({ feature = "premium features", className }: UpgradeCTAProps) {
  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log('Upgrade clicked');
  };

  return (
    <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Unlock Premium Features</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            <Zap className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upgrade to access {feature} and get the most accurate vehicle valuations.
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3 text-primary" />
            <span>PDF Reports</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-3 h-3 text-primary" />
            <span>Advanced Sharing</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3 h-3 text-primary" />
            <span>Market Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            <span>Priority Support</span>
          </div>
        </div>

        <Button onClick={handleUpgrade} className="w-full" size="sm">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );
}