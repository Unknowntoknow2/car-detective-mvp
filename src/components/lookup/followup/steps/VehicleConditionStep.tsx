
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Car, Wrench, Palette, CircleDot } from 'lucide-react';

interface VehicleConditionData {
  exteriorCondition: string;
  interiorCondition: string;
  mechanicalCondition: string;
  paintCondition: string;
  notes?: string;
}

interface VehicleConditionStepProps {
  onComplete: (data: VehicleConditionData) => void;
  onSkip: () => void;
  initialData?: Partial<VehicleConditionData>;
}

export const VehicleConditionStep: React.FC<VehicleConditionStepProps> = ({
  onComplete,
  onSkip,
  initialData = {}
}) => {
  const [data, setData] = useState<VehicleConditionData>({
    exteriorCondition: initialData.exteriorCondition || '',
    interiorCondition: initialData.interiorCondition || '',
    mechanicalCondition: initialData.mechanicalCondition || '',
    paintCondition: initialData.paintCondition || '',
    notes: initialData.notes || ''
  });

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
    { value: 'good', label: 'Good', description: 'Minor wear, well maintained' },
    { value: 'fair', label: 'Fair', description: 'Moderate wear, some issues' },
    { value: 'poor', label: 'Poor', description: 'Significant wear or damage' }
  ];

  const isComplete = data.exteriorCondition && data.interiorCondition && 
                   data.mechanicalCondition && data.paintCondition;

  const handleSubmit = () => {
    if (isComplete) {
      onComplete(data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Condition Assessment</h2>
        <p className="text-gray-600">
          Please rate the condition of different aspects of your vehicle. This helps us provide a more accurate valuation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Exterior Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={data.exteriorCondition} 
              onValueChange={(value) => setData(prev => ({ ...prev, exteriorCondition: value }))}
            >
              {conditionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`exterior-${option.value}`} />
                  <Label htmlFor={`exterior-${option.value}`} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="h-5 w-5" />
              Interior Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={data.interiorCondition} 
              onValueChange={(value) => setData(prev => ({ ...prev, interiorCondition: value }))}
            >
              {conditionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`interior-${option.value}`} />
                  <Label htmlFor={`interior-${option.value}`} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Mechanical Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={data.mechanicalCondition} 
              onValueChange={(value) => setData(prev => ({ ...prev, mechanicalCondition: value }))}
            >
              {conditionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mechanical-${option.value}`} />
                  <Label htmlFor={`mechanical-${option.value}`} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Paint Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={data.paintCondition} 
              onValueChange={(value) => setData(prev => ({ ...prev, paintCondition: value }))}
            >
              {conditionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`paint-${option.value}`} />
                  <Label htmlFor={`paint-${option.value}`} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional details about your vehicle's condition, recent repairs, or modifications..."
            value={data.notes}
            onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="flex-1"
        >
          Continue ({isComplete ? '4/4 Complete' : `${Object.values(data).filter(v => v && v !== '').length}/4 Complete`})
        </Button>
        <Button
          variant="outline"
          onClick={onSkip}
          className="px-8"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
};
