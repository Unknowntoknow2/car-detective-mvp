
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const accidentHistory = formData.accident_history || {
    hadAccident: false,
    count: 0,
    location: '',
    severity: 'minor' as const,
    repaired: false,
    frameDamage: false,
    description: ''
  };

  const updateAccidentHistory = (updates: Partial<AccidentDetails>) => {
    updateFormData({
      accident_history: {
        ...accidentHistory,
        ...updates
      }
    });
  };

  const severityOptions = [
    { 
      value: 'minor' as const, 
      label: 'Minor', 
      description: 'Cosmetic damage only, no structural issues',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800'
    },
    { 
      value: 'moderate' as const, 
      label: 'Moderate', 
      description: 'Some mechanical damage, required professional repair',
      color: 'bg-orange-100 border-orange-500 text-orange-800'
    },
    { 
      value: 'major' as const, 
      label: 'Major', 
      description: 'Significant damage, extensive repairs needed',
      color: 'bg-red-100 border-red-500 text-red-800'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Accident History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has Accident */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Has this vehicle been in any accidents?</Label>
            <RadioGroup
              value={accidentHistory.hadAccident ? 'yes' : 'no'}
              onValueChange={(value) => updateAccidentHistory({ hadAccident: value === 'yes' })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="no" id="no-accident" />
                <Label htmlFor="no-accident" className="cursor-pointer flex-1">
                  <div className="font-medium">No Accidents</div>
                  <div className="text-sm text-gray-500">Clean accident history</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="yes" id="yes-accident" />
                <Label htmlFor="yes-accident" className="cursor-pointer flex-1">
                  <div className="font-medium">Has Accidents</div>
                  <div className="text-sm text-gray-500">One or more accidents</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Accident Details */}
          {accidentHistory.hadAccident && (
            <div className="space-y-6 border-t pt-6">
              {/* Severity */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Accident Severity</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {severityOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => updateAccidentHistory({ severity: option.value })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        accidentHistory.severity === option.value
                          ? option.color
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Number of Accidents */}
              <div className="space-y-2">
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  min="0"
                  max="10"
                  value={accidentHistory.count || 0}
                  onChange={(e) => updateAccidentHistory({ 
                    count: parseInt(e.target.value) || 0 
                  })}
                  className="w-32"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="accident-location">Primary Damage Area</Label>
                <Input
                  id="accident-location"
                  placeholder="e.g., Front bumper, Driver side, Rear quarter panel"
                  value={accidentHistory.location || ''}
                  onChange={(e) => updateAccidentHistory({ location: e.target.value })}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="repaired"
                    checked={accidentHistory.repaired || false}
                    onCheckedChange={(checked) => updateAccidentHistory({ 
                      repaired: checked === true 
                    })}
                  />
                  <Label htmlFor="repaired" className="cursor-pointer">
                    All damage has been professionally repaired
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="frame-damage"
                    checked={accidentHistory.frameDamage || false}
                    onCheckedChange={(checked) => updateAccidentHistory({ 
                      frameDamage: checked === true 
                    })}
                  />
                  <Label htmlFor="frame-damage" className="cursor-pointer">
                    Frame or structural damage occurred
                  </Label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="accident-description">Additional Details (Optional)</Label>
                <Textarea
                  id="accident-description"
                  placeholder="Describe the accident circumstances, repairs made, or any other relevant information..."
                  value={accidentHistory.description || ''}
                  onChange={(e) => updateAccidentHistory({ 
                    description: e.target.value 
                  })}
                  rows={3}
                />
              </div>

              {/* Impact Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Value Impact Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Minor accidents: -5% to -10% value impact</li>
                  <li>• Moderate accidents: -10% to -20% value impact</li>
                  <li>• Major accidents: -20% to -35% value impact</li>
                  <li>• Frame damage: Additional -15% to -25% value impact</li>
                  <li>• Professional repairs help minimize value loss</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
