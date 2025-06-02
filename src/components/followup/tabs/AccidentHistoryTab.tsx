
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Car, Shield, Wrench } from 'lucide-react';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const SEVERITY_OPTIONS = [
  {
    value: 'minor' as const,
    label: 'Minor',
    description: 'Cosmetic damage, no structural issues',
    impact: '-$200-800',
    color: 'yellow'
  },
  {
    value: 'moderate' as const,
    label: 'Moderate',
    description: 'Some structural damage, airbags may have deployed',
    impact: '-$1000-3000',
    color: 'orange'
  },
  {
    value: 'severe' as const,
    label: 'Severe',
    description: 'Major structural damage, significant repairs needed',
    impact: '-$3000-8000',
    color: 'red'
  }
];

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const accidentData = formData.accident_history || {
    hadAccident: false,
    count: 0,
    location: '',
    severity: 'minor',
    repaired: false,
    frameDamage: false,
    description: ''
  };

  const handleAccidentToggle = (checked: boolean) => {
    updateFormData({
      accident_history: {
        ...accidentData,
        hadAccident: checked,
        ...(checked ? {} : {
          count: 0,
          location: '',
          severity: 'minor',
          repaired: false,
          frameDamage: false,
          description: ''
        })
      }
    });
  };

  const handleFieldChange = (field: keyof AccidentDetails, value: any) => {
    updateFormData({
      accident_history: {
        ...accidentData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Accident Toggle */}
      <div className="p-3 rounded-lg border bg-red-50 border-red-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <h3 className="font-medium text-sm">Accident History</h3>
        </div>
        
        <div
          className={`p-2 rounded-md border cursor-pointer transition-all ${
            accidentData.hadAccident
              ? 'bg-red-100 border-red-300'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleAccidentToggle(!accidentData.hadAccident)}
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={accidentData.hadAccident}
              onCheckedChange={handleAccidentToggle}
              className="pointer-events-none"
            />
            <div>
              <div className="font-medium text-xs">Has Been in Accident</div>
              <div className="text-xs text-gray-600 mt-1">
                Vehicle has been involved in any type of collision or accident
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accident Details */}
      {accidentData.hadAccident && (
        <div className="space-y-4">
          {/* Number of Accidents & Location */}
          <div className="p-3 rounded-lg border bg-orange-50 border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-4 w-4 text-orange-600" />
              <h3 className="font-medium text-sm">Accident Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Number of Accidents</label>
                <Input
                  type="number"
                  min="1"
                  value={accidentData.count || ''}
                  onChange={(e) => handleFieldChange('count', parseInt(e.target.value) || 0)}
                  className="h-8 text-xs"
                  placeholder="e.g., 1"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Damage Location</label>
                <Input
                  value={accidentData.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g., Front bumper"
                />
              </div>
            </div>
          </div>

          {/* Severity Selection */}
          <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-yellow-600" />
              <h3 className="font-medium text-sm">Accident Severity</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {SEVERITY_OPTIONS.map((option) => {
                const isSelected = accidentData.severity === option.value;
                
                return (
                  <div
                    key={option.value}
                    className={`p-2 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? `bg-${option.color}-100 border-${option.color}-300`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFieldChange('severity', option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          isSelected 
                            ? `bg-${option.color}-500 border-${option.color}-500` 
                            : 'border-gray-300'
                        }`} />
                        <div>
                          <div className="font-medium text-xs">{option.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded bg-${option.color}-100 text-${option.color}-700`}>
                        {option.impact}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repair Status */}
          <div className="p-3 rounded-lg border bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-sm">Repair Status</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-2 rounded-md border cursor-pointer transition-all ${
                  accidentData.repaired
                    ? 'bg-green-100 border-green-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFieldChange('repaired', !accidentData.repaired)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={accidentData.repaired || false}
                    onCheckedChange={(checked) => handleFieldChange('repaired', checked)}
                    className="pointer-events-none"
                  />
                  <div>
                    <div className="font-medium text-xs">Professionally Repaired</div>
                    <div className="text-xs text-gray-600 mt-1">Repaired by certified shop</div>
                  </div>
                </div>
              </div>

              <div
                className={`p-2 rounded-md border cursor-pointer transition-all ${
                  accidentData.frameDamage
                    ? 'bg-red-100 border-red-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFieldChange('frameDamage', !accidentData.frameDamage)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={accidentData.frameDamage || false}
                    onCheckedChange={(checked) => handleFieldChange('frameDamage', checked)}
                    className="pointer-events-none"
                  />
                  <div>
                    <div className="font-medium text-xs">Frame Damage</div>
                    <div className="text-xs text-gray-600 mt-1">Structural frame affected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
            <label className="text-xs font-medium text-gray-700 mb-2 block">Additional Details</label>
            <Textarea
              value={accidentData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Describe the accident, repairs performed, insurance claims..."
              rows={2}
              className="text-xs"
            />
          </div>

          {/* Impact Notice */}
          <div className="p-2 bg-red-100 rounded-md border border-red-300">
            <p className="text-xs text-red-800">
              <strong>Impact:</strong> Accident history can significantly reduce vehicle value, especially with frame damage or poor repairs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
