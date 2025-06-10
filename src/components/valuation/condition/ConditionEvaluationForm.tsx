
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConditionEvaluationFormProps {
  onConditionChange?: (condition: string) => void;
}

export const ConditionEvaluationForm: React.FC<ConditionEvaluationFormProps> = ({
  onConditionChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Condition Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Detailed condition evaluation form will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};

export default ConditionEvaluationForm;
