
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';
import { AlertTriangle, Shield, FileText, Wrench } from 'lucide-react';

interface AccidentsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const accidentTypes = [
  'Front-end collision',
  'Rear-end collision', 
  'Side impact',
  'Rollover',
  'Multi-vehicle accident',
  'Hit and run',
  'Weather-related accident',
  'Parking lot incident',
  'Animal collision'
];

const repairShopTypes = [
  'Authorized dealer',
  'Certified collision center',
  'Independent body shop',
  'Insurance-preferred shop',
  'DIY/Self-repaired',
  'Mobile repair service'
];

export function AccidentsTab({ formData, updateFormData }: AccidentsTabProps) {
  const accidents = formData.accidents || {
    hadAccident: false,
    count: 0,
    severity: 'minor',
    repaired: false,
    frameDamage: false,
    description: '',
    types: [],
    repairShops: [],
    airbagDeployment: false
  };

  const updateAccidents = (updates: Partial<AccidentDetails>) => {
    updateFormData({
      accidents: { ...accidents, ...updates }
    });
  };

  const handleAccidentStatusChange = (hadAccident: string) => {
    const hasAccident = hadAccident === 'yes';
    updateAccidents({
      hadAccident: hasAccident,
      count: hasAccident ? Math.max(1, accidents.count) : 0,
      types: hasAccident ? accidents.types : [],
      repairShops: hasAccident ? accidents.repairShops : [],
      description: hasAccident ? accidents.description : '',
      severity: hasAccident ? accidents.severity : 'minor',
      repaired: hasAccident ? accidents.repaired : false,
      frameDamage: hasAccident ? accidents.frameDamage : false,
      airbagDeployment: hasAccident ? accidents.airbagDeployment : false
    });
  };

  const handleAccidentTypeChange = (type: string, checked: boolean) => {
    const currentTypes = accidents.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    updateAccidents({ types: updatedTypes });
  };

  const handleRepairShopChange = (shop: string, checked: boolean) => {
    const currentShops = accidents.repairShops || [];
    const updatedShops = checked 
      ? [...currentShops, shop]
      : currentShops.filter(s => s !== shop);
    updateAccidents({ repairShops: updatedShops });
  };

  return (
    <div className="space-y-6">
      {/* Primary Accident Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Accident History
          </CardTitle>
          <p className="text-sm text-gray-600">
            Has this vehicle ever been involved in any accidents or collisions?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={accidents.hadAccident ? 'yes' : 'no'}
            onValueChange={handleAccidentStatusChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accidents" />
              <Label htmlFor="no-accidents" className="font-medium">No accidents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-accidents" />
              <Label htmlFor="has-accidents" className="font-medium">Yes, has been in accident(s)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Detailed Accident Information */}
      {accidents.hadAccident && (
        <>
          {/* Accident Count and Severity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Accident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accident-count">Number of Accidents</Label>
                  <Input
                    id="accident-count"
                    type="number"
                    min="1"
                    max="10"
                    value={accidents.count || 1}
                    onChange={(e) => updateAccidents({ count: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="accident-severity">Overall Severity</Label>
                  <Select
                    value={accidents.severity}
                    onValueChange={(value: 'minor' | 'moderate' | 'major') => 
                      updateAccidents({ severity: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                      <SelectItem value="moderate">Moderate (structural repair needed)</SelectItem>
                      <SelectItem value="major">Major (extensive damage/totaled)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accident Types */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Accidents</CardTitle>
              <p className="text-sm text-gray-600">
                Select all types of accidents this vehicle has experienced
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {accidentTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`accident-${type}`}
                      checked={accidents.types?.includes(type) || false}
                      onCheckedChange={(checked) => 
                        handleAccidentTypeChange(type, checked as boolean)
                      }
                    />
                    <Label htmlFor={`accident-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Damage Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Damage Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Frame/Structural Damage</Label>
                    <p className="text-sm text-gray-600">Any damage to the vehicle's frame or structure</p>
                  </div>
                  <Checkbox
                    checked={accidents.frameDamage}
                    onCheckedChange={(checked) => updateAccidents({ frameDamage: checked as boolean })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Airbag Deployment</Label>
                    <p className="text-sm text-gray-600">Did any airbags deploy during the accident</p>
                  </div>
                  <Checkbox
                    checked={accidents.airbagDeployment}
                    onCheckedChange={(checked) => updateAccidents({ airbagDeployment: checked as boolean })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="repair-status">Repair Status</Label>
                <Select
                  value={accidents.repaired ? 'yes' : 'no'}
                  onValueChange={(value) => updateAccidents({ repaired: value === 'yes' })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Fully repaired</SelectItem>
                    <SelectItem value="no">Not repaired/Partial repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Repair History */}
          {accidents.repaired && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-green-500" />
                  Repair History
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Where was the vehicle repaired?
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {repairShopTypes.map((shop) => (
                    <div key={shop} className="flex items-center space-x-2">
                      <Checkbox
                        id={`shop-${shop}`}
                        checked={accidents.repairShops?.includes(shop) || false}
                        onCheckedChange={(checked) => 
                          handleRepairShopChange(shop, checked as boolean)
                        }
                      />
                      <Label htmlFor={`shop-${shop}`} className="text-sm">
                        {shop}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
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
                value={accidents.description || ''}
                onChange={(e) => updateAccidents({ description: e.target.value })}
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
