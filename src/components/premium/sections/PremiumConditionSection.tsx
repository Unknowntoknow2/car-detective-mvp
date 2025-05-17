
import React, { useState } from 'react';
import { DetailedConditionRating } from '@/components/premium/condition/DetailedConditionRating';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PremiumConditionSectionProps {
  onSaveCondition?: (values: Record<string, number>) => void;
}

export function PremiumConditionSection({ onSaveCondition }: PremiumConditionSectionProps) {
  const [conditionValues, setConditionValues] = useState<Record<string, number>>({});
  
  const handleConditionChange = (value: number, category: string) => {
    setConditionValues(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const handleSave = () => {
    if (onSaveCondition) {
      onSaveCondition(conditionValues);
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Premium Condition Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Our premium condition assessment allows you to rate your vehicle's condition in detail.
          Each 5% change in condition rating affects your vehicle's value differently.
        </p>
        
        <DetailedConditionRating 
          onConditionChange={handleConditionChange}
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSave} className="mt-4">
            Save Assessment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
