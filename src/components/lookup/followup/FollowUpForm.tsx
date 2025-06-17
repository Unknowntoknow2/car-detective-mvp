
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FollowUpFormProps {
  onSubmit?: (data: any) => void;
  apiData?: any;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit, apiData }) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({});
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Please provide additional details to improve your valuation accuracy.
        </p>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowUpForm;
