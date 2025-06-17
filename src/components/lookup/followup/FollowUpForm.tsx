
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FollowUpFormProps {
  onSubmit?: (data: any) => Promise<void>;
  apiData?: {
    make: string;
    model: string;
    year: number;
    zipCode: string;
  };
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit, apiData }) => {
  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit({
        ...apiData,
        condition: 'good',
        mileage: 50000
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Information</CardTitle>
      </CardHeader>
      <CardContent>
        {apiData && (
          <div className="space-y-2 mb-4">
            <p><strong>Vehicle:</strong> {apiData.year} {apiData.make} {apiData.model}</p>
            <p><strong>Location:</strong> {apiData.zipCode}</p>
          </div>
        )}
        <p className="text-muted-foreground mb-4">
          Please provide additional details to improve your valuation accuracy.
        </p>
        <Button onClick={handleSubmit}>
          Submit Follow-up
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowUpForm;
