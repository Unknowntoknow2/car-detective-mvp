
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Car, Shield } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const accidentTypes = [
  { value: 'front_end', label: 'Front-end collision', severity: 'high' },
  { value: 'rear_end', label: 'Rear-end collision', severity: 'medium' },
  { value: 'side_impact', label: 'Side impact', severity: 'high' },
  { value: 'rollover', label: 'Rollover', severity: 'critical' },
  { value: 'multi_vehicle', label: 'Multi-vehicle accident', severity: 'high' },
  { value: 'hit_and_run', label: 'Hit and run', severity: 'medium' },
  { value: 'weather_related', label: 'Weather-related accident', severity: 'medium' },
  { value: 'parking_lot', label: 'Parking lot incident', severity: 'low' },
  { value: 'animal_collision', label: 'Animal collision', severity: 'medium' }
];

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const hasAccident = formData.accidents?.hadAccident || false;

  const handleAccidentChange = (value: string) => {
    const hadAccident = value === 'yes';
    updateFormData({
      accidents: {
        hadAccident,
        count: hadAccident ? (formData.accidents?.count || 1) : 0,
        severity: hadAccident ? (formData.accidents?.severity || 'minor') : 'minor',
        repaired: hadAccident ? (formData.accidents?.repaired || false) : false,
        frameDamage: hadAccident ? (formData.accidents?.frameDamage || false) : false,
        location: hadAccident ? (formData.accidents?.location || '') : '',
        description: hadAccident ? (formData.accidents?.description || '') : '',
        types: hadAccident ? (formData.accidents?.types || []) : [],
        repairShops: hadAccident ? (formData.accidents?.repairShops || []) : [],
        airbagDeployment: hadAccident ? (formData.accidents?.airbagDeployment || false) : false
      }
    });
  };

  const handleAccidentDetailChange = (field: string, value: any) => {
    updateFormData({
      accidents: {
        ...formData.accidents,
        hadAccident: formData.accidents?.hadAccident || false,
        count: formData.accidents?.count || 1,
        severity: formData.accidents?.severity || 'minor',
        repaired: formData.accidents?.repaired || false,
        frameDamage: formData.accidents?.frameDamage || false,
        location: formData.accidents?.location || '',
        description: formData.accidents?.description || '',
        types: formData.accidents?.types || [],
        repairShops: formData.accidents?.repairShops || [],
        airbagDeployment: formData.accidents?.airbagDeployment || false,
        [field]: value
      }
    });
  };

  const handleAccidentTypeChange = (type: string, checked: boolean) => {
    const currentTypes = formData.accidents?.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    handleAccidentDetailChange('types', updatedTypes);
  };

  return (
    <div className="space-y-6">
      {/* Main Accident Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Accident History
          </CardTitle>
          <p className="text-sm text-gray-600">
            Has this vehicle ever been involved in any accidents or collisions?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasAccident ? 'yes' : 'no'}
            onValueChange={handleAccidentChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="no" id="accident-no" />
              <Label htmlFor="accident-no" className="cursor-pointer">
                <div>
                  <div className="font-medium">No accidents</div>
                  <div className="text-sm text-gray-500">Clean accident history</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="yes" id="accident-yes" />
              <Label htmlFor="accident-yes" className="cursor-pointer">
                <div>
                  <div className="font-medium">Yes, has been in accident(s)</div>
                  <div className="text-sm text-gray-500">Provide details below</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Accident Details */}
      {hasAccident && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Accident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accident-count">Number of Accidents</Label>
                  <Input
                    id="accident-count"
                    type="number"
                    min="1"
                    value={formData.accidents?.count || 1}
                    onChange={(e) => handleAccidentDetailChange('count', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="accident-severity">Overall Severity</Label>
                  <Select 
                    value={formData.accidents?.severity || 'minor'} 
                    onValueChange={(value) => handleAccidentDetailChange('severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                      <SelectItem value="moderate">Moderate (required repairs)</SelectItem>
                      <SelectItem value="major">Major (extensive damage)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types of Accidents</CardTitle>
              <p className="text-sm text-gray-600">
                Select all types of accidents this vehicle has experienced
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {accidentTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2 border rounded-lg p-3">
                    <Checkbox
                      id={type.value}
                      checked={formData.accidents?.types?.includes(type.value) || false}
                      onCheckedChange={(checked) => handleAccidentTypeChange(type.value, checked as boolean)}
                    />
                    <Label htmlFor={type.value} className="cursor-pointer flex-1">
                      <div className="font-medium">{type.label}</div>
                      <div className={`text-xs ${
                        type.severity === 'critical' ? 'text-red-600' :
                        type.severity === 'high' ? 'text-orange-600' :
                        type.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {type.severity.charAt(0).toUpperCase() + type.severity.slice(1)} impact
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Damage Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Frame/Structural Damage</Label>
                <p className="text-xs text-gray-600 mb-2">Any damage to the vehicle's frame or structure</p>
                <RadioGroup
                  value={formData.accidents?.frameDamage ? 'yes' : 'no'}
                  onValueChange={(value) => handleAccidentDetailChange('frameDamage', value === 'yes')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="frame-no" />
                    <Label htmlFor="frame-no">No frame damage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="frame-yes" />
                    <Label htmlFor="frame-yes">Frame damage present</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Airbag Deployment</Label>
                <p className="text-xs text-gray-600 mb-2">Did any airbags deploy during the accident</p>
                <RadioGroup
                  value={formData.accidents?.airbagDeployment ? 'yes' : 'no'}
                  onValueChange={(value) => handleAccidentDetailChange('airbagDeployment', value === 'yes')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="airbag-no" />
                    <Label htmlFor="airbag-no">No airbag deployment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="airbag-yes" />
                    <Label htmlFor="airbag-yes">Airbags deployed</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="repair-status">Repair Status</Label>
                <Select
                  value={formData.accidents?.repaired ? 'repaired' : 'not_repaired'}
                  onValueChange={(value) => handleAccidentDetailChange('repaired', value === 'repaired')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repaired">Fully repaired</SelectItem>
                    <SelectItem value="not_repaired">Not repaired/Partial repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <p className="text-sm text-gray-600">
                Provide any additional information about the accidents
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Include details such as: insurance claims filed, police reports, extent of damage, repair costs, time off road, etc."
                value={formData.accidents?.description || ''}
                onChange={(e) => handleAccidentDetailChange('description', e.target.value)}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
