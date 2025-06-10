
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AICondition } from '@/types/photo';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange: (score: number, condition?: AICondition) => void;
  isPremium: boolean;
}

export const PhotoUploadAndScore: React.FC<PhotoUploadAndScoreProps> = ({
  valuationId,
  onScoreChange,
  isPremium
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Photo upload and AI analysis will be available soon.
        </p>
      </CardContent>
    </Card>
  );
};
