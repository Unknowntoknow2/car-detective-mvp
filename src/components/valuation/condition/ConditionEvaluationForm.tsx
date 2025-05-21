
import React from 'react';
import { ConditionValues } from './types';

interface ConditionEvaluationFormProps {
  values: ConditionValues;
  onChange: (values: ConditionValues) => void;
}

export const ConditionEvaluationForm: React.FC<ConditionEvaluationFormProps> = ({ values, onChange }) => {
  // Define the categories for evaluation
  const categories = ['exteriorBody', 'exteriorPaint', 'interiorSeats', 'interiorDashboard', 
                      'mechanicalEngine', 'mechanicalTransmission', 'tiresCondition'];
  
  // Calculate the sum correctly - parse string values to numbers for calculation
  const sum = categories.reduce((acc, key) => {
    const value = values[key];
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : (typeof value === 'number' ? value : 0);
    return acc + numericValue;
  }, 0);
  
  const average = categories.length > 0 ? sum / categories.length : 0;
  
  // For demonstration - this would display the average condition score
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium">Average Condition Score: {average.toFixed(1)}</h3>
        <p className="text-sm text-muted-foreground">
          Based on your evaluation of all vehicle condition factors
        </p>
      </div>
      
      {/* Additional form elements would go here */}
    </div>
  );
};

export default ConditionEvaluationForm;
