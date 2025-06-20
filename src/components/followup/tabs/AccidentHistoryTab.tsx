import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const accidentTypes = [
  'Front-end collision',
  'Rear-end collision',
  'Side impact',
  'Rollover',
  'Flood damage',
  'Hail damage',
];

const repairShops = [
  'Dealership',
  'Certified repair shop',
  'Independent shop',
  'DIY repair',
  'Insurance recommended',
];

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  // Convert string to object if needed, or use default
  const getAccidentData = (): AccidentDetails => {
    if (typeof formData.accident_history === 'object' && formData.accident_history !== null) {
      return formData.accident_history;
    }
    return {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      types: [],
      repairShops: []
    };
  };

  const accidentData = getAccidentData();

  const handleAccidentToggle = (hadAccident: boolean) => {
    const updatedData: AccidentDetails = {
      hadAccident,
      count: hadAccident ? (accidentData.count || 1) : 0,
      severity: hadAccident ? (accidentData.severity || 'minor') : 'minor',
      repaired: hadAccident ? (accidentData.repaired || false) : false,
      frameDamage: hadAccident ? (accidentData.frameDamage || false) : false,
      types: hadAccident ? (accidentData.types || []) : [],
      repairShops: hadAccident ? (accidentData.repairShops || []) : []
    };
    updateFormData({ accident_history: updatedData });
  };

  const handleAccidentTypeChange = (checked: boolean, accidentType: string) => {
    const currentTypes = accidentData.types || [];
    let updatedTypes;

    if (checked) {
      updatedTypes = [...currentTypes, accidentType];
    } else {
      updatedTypes = currentTypes.filter((type: string) => type !== accidentType);
    }

    const updatedData: AccidentDetails = {
      ...accidentData,
      hadAccident: true,
      types: updatedTypes
    };
    updateFormData({ accident_history: updatedData });
  };

  const handleRepairShopChange = (checked: boolean, shopType: string) => {
    const currentShops = accidentData.repairShops || [];
    let updatedShops;

    if (checked) {
      updatedShops = [...currentShops, shopType];
    } else {
      updatedShops = currentShops.filter((shop: string) => shop !== shopType);
    }

    const updatedData: AccidentDetails = {
      ...accidentData,
      repairShops: updatedShops
    };
    updateFormData({ accident_history: updatedData });
  };

  const handleFieldChange = (field: keyof AccidentDetails, value: any) => {
    const updatedData: AccidentDetails = {
      ...accidentData,
      [field]: value
    };
    updateFormData({ accident_history: updatedData });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accident History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={!accidentData.hadAccident ? "default" : "outline"}
              onClick={() => handleAccidentToggle(false)}
            >
              No Accidents
            </Button>
            <Button
              type="button"
              variant={accidentData.hadAccident ? "default" : "outline"}
              onClick={() => handleAccidentToggle(true)}
            >
              Has Accident History
            </Button>
          </div>

          {accidentData.hadAccident && (
            <div className="space-y-4">
              <div>
                <Label>Number of Accidents</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={accidentData.count || 1}
                  onChange={(e) => handleFieldChange('count', parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <Label>Severity</Label>
                <div className="flex gap-2 mt-2">
                  {(['minor', 'moderate', 'major'] as const).map((severity) => (
                    <Button
                      key={severity}
                      type="button"
                      variant={accidentData.severity === severity ? "default" : "outline"}
                      onClick={() => handleFieldChange('severity', severity)}
                      className="capitalize"
                    >
                      {severity}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Types of Accidents</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {accidentTypes.map((accidentType) => (
                    <div key={accidentType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`accident-${accidentType}`}
                        checked={accidentData.types?.includes(accidentType) || false}
                        onCheckedChange={(checked: boolean) => handleAccidentTypeChange(checked, accidentType)}
                      />
                      <Label htmlFor={`accident-${accidentType}`} className="text-sm cursor-pointer">
                        {accidentType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Repair Shops Used</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {repairShops.map((shopType) => (
                    <div key={shopType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`shop-${shopType}`}
                        checked={accidentData.repairShops?.includes(shopType) || false}
                        onCheckedChange={(checked: boolean) => handleRepairShopChange(checked, shopType)}
                      />
                      <Label htmlFor={`shop-${shopType}`} className="text-sm cursor-pointer">
                        {shopType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="accident-description">Additional Details</Label>
                <Textarea
                  id="accident-description"
                  placeholder="Describe the accident details, repairs made, etc."
                  value={accidentData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
