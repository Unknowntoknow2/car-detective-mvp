import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface AccidentHistoryStepProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryStep({ formData, updateFormData }: AccidentHistoryStepProps) {
  const defaultAccidentDetails: AccidentDetails = {
    hadAccident: false,
    count: 0,
    location: '',
    severity: 'minor',
    repaired: false,
    frameDamage: false,
    description: '',
    types: [],
    repairShops: []
  };

  // Type guard to ensure we have an AccidentDetails object
  const getAccidentHistory = (): AccidentDetails => {
    if (typeof formData.accident_history === 'object' && formData.accident_history !== null) {
      return { ...defaultAccidentDetails, ...formData.accident_history };
    }
    return defaultAccidentDetails;
  };

  const accidentHistory = getAccidentHistory();

  const updateAccidentHistory = (updates: Partial<AccidentDetails>) => {
    const updatedDetails: AccidentDetails = {
      ...accidentHistory,
      ...updates
    };
    updateFormData({ accident_history: updatedDetails });
  };

  const handleCountChange = (value: string) => {
    const count = value === '' ? 0 : parseInt(value, 10);
    updateAccidentHistory({ count: isNaN(count) ? 0 : count });
  };

  const handleLocationChange = (value: string) => {
    updateAccidentHistory({ location: value });
  };

  const handleTypesChange = (types: string[]) => {
    updateAccidentHistory({ types });
  };

  const handleSeverityChange = (value: string) => {
    updateAccidentHistory({ severity: value as 'minor' | 'moderate' | 'severe' });
  };

  const handleRepairedChange = (repaired: boolean) => {
    updateAccidentHistory({ repaired });
  };

  const handleFrameDamageChange = (frameDamage: boolean) => {
    updateAccidentHistory({ frameDamage });
  };

  const handleDescriptionChange = (value: string) => {
    updateAccidentHistory({ description: value });
  };

  const handleRepairShopsChange = (repairShops: string[]) => {
    updateAccidentHistory({ repairShops });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="accident-count">Number of Accidents</Label>
        <Input
          type="number"
          id="accident-count"
          value={accidentHistory.count?.toString() || '0'}
          onChange={(e) => handleCountChange(e.target.value)}
          placeholder="Enter number of accidents"
        />
      </div>

      <div>
        <Label htmlFor="accident-location">Primary Accident Location</Label>
        <Input
          type="text"
          id="accident-location"
          value={accidentHistory.location || ''}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder="e.g., Front end, Driver side, etc."
        />
      </div>

      <div>
        <Label htmlFor="accident-severity">Accident Severity</Label>
        <Select value={accidentHistory.severity} onValueChange={handleSeverityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="severe">Severe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="repaired"
          checked={accidentHistory.repaired || false}
          onCheckedChange={(checked: boolean) => handleRepairedChange(checked)}
        />
        <Label htmlFor="repaired">Vehicle has been repaired</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="frame-damage"
          checked={accidentHistory.frameDamage || false}
          onCheckedChange={(checked: boolean) => handleFrameDamageChange(checked)}
        />
        <Label htmlFor="frame-damage">Frame damage occurred</Label>
      </div>

      <div>
        <Label htmlFor="accident-description">Accident Description</Label>
        <Textarea
          id="accident-description"
          value={accidentHistory.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe the accident and any repairs made..."
        />
      </div>
    </div>
  );
}
