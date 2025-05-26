
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Camera } from 'lucide-react';
import { DecodedVehicleInfo } from '@/types/vehicle';

interface FollowupStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    category: string;
    weight: number;
  };
  value: any;
  onComplete: (data: any) => void;
  vehicle: DecodedVehicleInfo;
}

export const FollowupStep: React.FC<FollowupStepProps> = ({
  step,
  value,
  onComplete,
  vehicle
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  const handleSubmit = () => {
    onComplete(localValue);
  };

  const renderStepContent = () => {
    switch (step.id) {
      case 'mileage':
        return (
          <div className="space-y-4">
            <Label htmlFor="mileage">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter current mileage"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Average for {vehicle.year} {vehicle.make} {vehicle.model}: ~{((new Date().getFullYear() - (vehicle.year || 2020)) * 12000).toLocaleString()} miles
            </p>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <Label>Overall Vehicle Condition</Label>
            <RadioGroup value={localValue} onValueChange={setLocalValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">Excellent - Like new, no visible wear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Good - Minor wear, well maintained</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair">Fair - Visible wear, needs minor repairs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor">Poor - Significant wear, needs major repairs</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'accidents':
        return (
          <div className="space-y-4">
            <Label>Accident History</Label>
            <RadioGroup value={localValue} onValueChange={setLocalValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="no-accidents" />
                <Label htmlFor="no-accidents">No accidents</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="one-accident" />
                <Label htmlFor="one-accident">1 minor accident</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2+" id="multiple-accidents" />
                <Label htmlFor="multiple-accidents">2+ accidents</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'title':
        return (
          <div className="space-y-4">
            <Label>Title Status</Label>
            <RadioGroup value={localValue} onValueChange={setLocalValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clean" id="clean" />
                <Label htmlFor="clean">Clean Title</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salvage" id="salvage" />
                <Label htmlFor="salvage">Salvage Title</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rebuilt" id="rebuilt" />
                <Label htmlFor="rebuilt">Rebuilt Title</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lemon" id="lemon" />
                <Label htmlFor="lemon">Lemon Title</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-4">
            <Label>Maintenance Records</Label>
            <RadioGroup value={localValue} onValueChange={setLocalValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complete" id="complete" />
                <Label htmlFor="complete">Complete service records available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial">Some service records available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No service records available</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <Label htmlFor="zipcode">ZIP Code</Label>
            <Input
              id="zipcode"
              type="text"
              placeholder="Enter ZIP code"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              maxLength={5}
            />
            <p className="text-sm text-gray-500">
              This helps us provide regional market pricing
            </p>
          </div>
        );

      case 'photos':
        return (
          <div className="space-y-4">
            <Label>Vehicle Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload photos of your vehicle</p>
              <p className="text-sm text-gray-500 mb-4">
                Include exterior, interior, engine bay, and any damage
              </p>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose Photos
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <Label htmlFor="other">Additional Information</Label>
            <Textarea
              id="other"
              placeholder="Enter additional details"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
      
      <Button 
        onClick={handleSubmit}
        disabled={!localValue}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};
