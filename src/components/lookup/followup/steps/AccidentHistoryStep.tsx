import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryStepProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryStep({ formData, updateFormData }: AccidentHistoryStepProps) {
  const handleAccidentChange = (checked: boolean) => {
    updateFormData({ accident_history: { ...formData.accident_history, hadAccident: checked } });
  };

  const handleAccidentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    updateFormData({ accident_history: { ...formData.accident_history, count: isNaN(count) ? undefined : count } });
  };

  const handleAccidentLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ accident_history: { ...formData.accident_history, location: e.target.value } });
  };

  // Fix the parameter type annotations
  const handleAccidentTypeChange = (value: string) => {
    const currentTypes = formData.accident_history?.types || [];
    const updatedTypes = currentTypes.includes(value)
      ? currentTypes.filter(type => type !== value)
      : [...currentTypes, value];
    updateFormData({ accident_history: { ...formData.accident_history, types: updatedTypes } });
  };

  // Fix the parameter type annotations
  const handleSeverityChange = (value: string) => {
    updateFormData({ accident_history: { ...formData.accident_history, severity: value as any } });
  };

  const handleRepairedChange = (checked: boolean) => {
    updateFormData({ accident_history: { ...formData.accident_history, repaired: checked } });
  };

  const handleFrameDamageChange = (checked: boolean) => {
    updateFormData({ accident_history: { ...formData.accident_history, frameDamage: checked } });
  };

  const handleAccidentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ accident_history: { ...formData.accident_history, description: e.target.value } });
  };

  // Fix the parameter type annotations
  const handleRepairShopChange = (value: string) => {
    const currentShops = formData.accident_history?.repairShops || [];
    const updatedShops = currentShops.includes(value)
      ? currentShops.filter(shop => shop !== value)
      : [...currentShops, value];
    updateFormData({ accident_history: { ...formData.accident_history, repairShops: updatedShops } });
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 bg-white shadow-sm">
        <Label className="block text-sm font-medium mb-2">Has this vehicle been in any accidents?</Label>
        <Checkbox
          id="hadAccident"
          checked={formData.accident_history?.hadAccident || false}
          onCheckedChange={handleAccidentChange}
        />
        <Label htmlFor="hadAccident" className="ml-2">Yes</Label>
      </div>

      {formData.accident_history?.hadAccident && (
        <div className="space-y-4 border rounded-md p-4 bg-white shadow-sm">
          <div>
            <Label htmlFor="accidentCount" className="block text-sm font-medium mb-2">Number of Accidents</Label>
            <Input
              type="number"
              id="accidentCount"
              value={formData.accident_history?.count?.toString() || ''}
              onChange={handleAccidentCountChange}
              placeholder="Enter number of accidents"
            />
          </div>

          <div>
            <Label htmlFor="accidentLocation" className="block text-sm font-medium mb-2">Accident Location</Label>
            <Input
              type="text"
              id="accidentLocation"
              value={formData.accident_history?.location || ''}
              onChange={handleAccidentLocationChange}
              placeholder="Enter location of accident"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Accident Type</Label>
            <div className="flex flex-wrap gap-2">
              {['Collision', 'Rollover', 'Fire', 'Flood', 'Vandalism', 'Other'].map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`accidentType-${type}`}
                    checked={formData.accident_history?.types?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleAccidentTypeChange(type);
                      } else {
                        handleAccidentTypeChange(type);
                      }
                    }}
                  />
                  <Label htmlFor={`accidentType-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="severity" className="block text-sm font-medium mb-2">Severity</Label>
            <Select
              value={formData.accident_history?.severity || ''}
              onValueChange={(value) => handleSeverityChange(value)}
            >
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
              checked={formData.accident_history?.repaired || false}
              onCheckedChange={handleRepairedChange}
            />
            <Label htmlFor="repaired">Was the vehicle repaired?</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="frameDamage"
              checked={formData.accident_history?.frameDamage || false}
              onCheckedChange={handleFrameDamageChange}
            />
            <Label htmlFor="frameDamage">Was there frame damage?</Label>
          </div>

          <div>
            <Label htmlFor="repairShops" className="block text-sm font-medium mb-2">Repair Shops</Label>
            <div className="flex flex-wrap gap-2">
              {['Shop A', 'Shop B', 'Shop C', 'Other'].map(shop => (
                <div key={shop} className="flex items-center space-x-2">
                  <Checkbox
                    id={`repairShop-${shop}`}
                    checked={formData.accident_history?.repairShops?.includes(shop) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleRepairShopChange(shop);
                      } else {
                        handleRepairShopChange(shop);
                      }
                    }}
                  />
                  <Label htmlFor={`repairShop-${shop}`}>{shop}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="accidentDescription" className="block text-sm font-medium mb-2">Description of Accident</Label>
            <Textarea
              id="accidentDescription"
              value={formData.accident_history?.description || ''}
              onChange={handleAccidentDescriptionChange}
              placeholder="Describe the accident in detail"
            />
          </div>
        </div>
      )}
    </div>
  );
}
