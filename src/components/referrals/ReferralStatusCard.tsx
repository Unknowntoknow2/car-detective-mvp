
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReferralStatusCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  maxValue?: number;
  showProgress?: boolean;
}

export function ReferralStatusCard({ 
  title, 
  value, 
  icon, 
  maxValue = 0, 
  showProgress = false 
}: ReferralStatusCardProps) {
  const progressValue = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {showProgress && maxValue > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {value} of {maxValue} maximum
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        
        {showProgress && (
          <Progress 
            value={progressValue} 
            max={100} 
            className="h-1 mt-4" 
          />
        )}
      </CardContent>
    </Card>
  );
}
