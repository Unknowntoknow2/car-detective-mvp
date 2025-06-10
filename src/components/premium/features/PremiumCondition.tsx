
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PremiumConditionProps {
  onConditionChange: (value: any) => void;
}

export const PremiumCondition: React.FC<PremiumConditionProps> = ({
  onConditionChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Condition Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Premium condition assessment will be available here.</p>
      </CardContent>
    </Card>
  );
};

export default PremiumCondition;
