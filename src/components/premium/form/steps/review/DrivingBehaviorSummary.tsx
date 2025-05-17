
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { Car } from 'lucide-react';

interface DrivingBehaviorSummaryProps {
  formData: FormData;
}

export function DrivingBehaviorSummary({ formData }: DrivingBehaviorSummaryProps) {
  const getDrivingLabel = (profile: string) => {
    switch (profile) {
      case 'light':
        return 'Light (mostly city driving, short distances)';
      case 'average':
        return 'Average (mix of city and highway driving)';
      case 'heavy':
        return 'Heavy (mostly highway, long distances)';
      default:
        return profile;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Driving Behavior</h3>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Car className="h-10 w-10 text-primary/50" />
            <div>
              <div className="font-medium text-gray-900">
                {getDrivingLabel(formData.drivingProfile || 'average')}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {formData.drivingProfile === 'light' 
                  ? 'Typically results in less wear and tear' 
                  : formData.drivingProfile === 'heavy'
                  ? 'May result in more wear and tear' 
                  : 'Balanced driving profile'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
