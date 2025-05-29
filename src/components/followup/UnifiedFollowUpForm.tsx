
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  FollowUpAnswers, 
  AccidentDetails, 
  ModificationDetails,
  CONDITION_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  DASHBOARD_LIGHTS,
  MODIFICATION_TYPES
} from '@/types/follow-up-answers';
import { AlertTriangle, Car, FileText, Wrench, Shield, Settings } from 'lucide-react';

interface UnifiedFollowUpFormProps {
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (data: FollowUpAnswers) => void;
  onSave?: (data: FollowUpAnswers) => void;
  isLoading?: boolean;
}

export function UnifiedFollowUpForm({
  initialData = {},
  onSubmit,
  onSave,
  isLoading = false
}: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: '',
    mileage: 0,
    condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    },
    modifications: {
      modified: false,
      types: [],
      reversible: false
    },
    completion_percentage: 0,
    ...initialData
  });

  // Update accidents data
  const updateAccidentData = (updates: Partial<AccidentDetails>) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        hadAccident: false,
        count: 0,
        severity: 'minor',
        repaired: false,
        frameDamage: false,
        description: '',
        ...prev.accidents,
        ...updates
      }
    }));
  };

  // Update modifications data
  const updateModificationData = (updates: Partial<ModificationDetails>) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        modified: false,
        types: [],
        reversible: false,
        ...prev.modifications,
        ...updates
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Basic Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                placeholder="Enter current mileage"
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                placeholder="Enter ZIP code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="condition">Overall Condition</Label>
              <Select 
                value={formData.condition || 'good'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.impact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exterior_condition">Exterior Condition</Label>
              <Select 
                value={formData.exterior_condition || 'good'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, exterior_condition: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exterior condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interior_condition">Interior Condition</Label>
              <Select 
                value={formData.interior_condition || 'good'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, interior_condition: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interior condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accident History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Accident History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Has this vehicle been in any accidents?</Label>
            <RadioGroup
              value={formData.accidents?.hadAccident ? 'yes' : 'no'}
              onValueChange={(value) => updateAccidentData({ hadAccident: value === 'yes' })}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="accident-no" />
                <Label htmlFor="accident-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="accident-yes" />
                <Label htmlFor="accident-yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.accidents?.hadAccident && (
            <div className="space-y-4 pl-4 border-l-2 border-orange-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accident-count">Number of Accidents</Label>
                  <Input
                    id="accident-count"
                    type="number"
                    min="1"
                    value={formData.accidents?.count || 1}
                    onChange={(e) => updateAccidentData({ count: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="accident-location">Location of Damage</Label>
                  <Select 
                    value={formData.accidents?.location || 'front'} 
                    onValueChange={(value) => updateAccidentData({ location: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">Front</SelectItem>
                      <SelectItem value="rear">Rear</SelectItem>
                      <SelectItem value="side">Side</SelectItem>
                      <SelectItem value="multiple">Multiple Areas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="accident-severity">Severity</Label>
                <Select 
                  value={formData.accidents?.severity || 'minor'} 
                  onValueChange={(value) => updateAccidentData({ severity: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="major">Major/Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="professionally-repaired"
                    checked={formData.accidents?.repaired || false}
                    onCheckedChange={(checked) => updateAccidentData({ repaired: checked as boolean })}
                  />
                  <Label htmlFor="professionally-repaired">Professionally repaired</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="frame-damage"
                    checked={formData.accidents?.frameDamage || false}
                    onCheckedChange={(checked) => updateAccidentData({ frameDamage: checked as boolean })}
                  />
                  <Label htmlFor="frame-damage">Frame damage</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="accident-description">Additional Details</Label>
                <Textarea
                  id="accident-description"
                  value={formData.accidents?.description || ''}
                  onChange={(e) => updateAccidentData({ description: e.target.value })}
                  placeholder="Describe the accident details, repairs made, etc."
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Title and Ownership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Title and Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title-status">Title Status</Label>
              <Select 
                value={formData.title_status || 'clean'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, title_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title status" />
                </SelectTrigger>
                <SelectContent>
                  {TITLE_STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.impact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="previous-owners">Number of Previous Owners</Label>
              <Input
                id="previous-owners"
                type="number"
                min="0"
                value={formData.previous_owners || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, previous_owners: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="previous-use">Previous Use</Label>
            <Select 
              value={formData.previous_use || 'personal'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, previous_use: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                {PREVIOUS_USE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.impact}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Service and Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Service and Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service-history">Service History</Label>
              <Select 
                value={formData.service_history || 'unknown'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_history: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service history" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_HISTORY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.impact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maintenance-status">Maintenance Status</Label>
              <Select 
                value={formData.maintenance_status || 'Unknown'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, maintenance_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Up to date">Up to date</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="last-service-date">Last Service Date</Label>
            <Input
              id="last-service-date"
              type="date"
              value={formData.last_service_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, last_service_date: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Physical Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Physical Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tire-condition">Tire Condition</Label>
            <Select 
              value={formData.tire_condition || 'good'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, tire_condition: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                {TIRE_CONDITION_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.impact}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dashboard Warning Lights</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {DASHBOARD_LIGHTS.map(light => (
                <div key={light.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`light-${light.value}`}
                    checked={(formData.dashboard_lights || []).includes(light.value)}
                    onCheckedChange={(checked) => {
                      const currentLights = formData.dashboard_lights || [];
                      if (checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          dashboard_lights: [...currentLights, light.value] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          dashboard_lights: currentLights.filter(l => l !== light.value) 
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={`light-${light.value}`} className="text-sm">
                    {light.icon} {light.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="frame-damage-general"
              checked={formData.frame_damage || false}
              disabled={true}
            />
            <Label htmlFor="frame-damage-general">Frame damage (auto-filled from accident history)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Modifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Modifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Has this vehicle been modified?</Label>
            <RadioGroup
              value={formData.modifications?.modified ? 'yes' : 'no'}
              onValueChange={(value) => updateModificationData({ modified: value === 'yes' })}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="modified-no" />
                <Label htmlFor="modified-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="modified-yes" />
                <Label htmlFor="modified-yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.modifications?.modified && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
              <div>
                <Label>Types of Modifications</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {MODIFICATION_TYPES.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mod-${type}`}
                        checked={(formData.modifications?.types || []).includes(type)}
                        onCheckedChange={(checked) => {
                          const currentTypes = formData.modifications?.types || [];
                          if (checked) {
                            updateModificationData({ types: [...currentTypes, type] });
                          } else {
                            updateModificationData({ types: currentTypes.filter(t => t !== type) });
                          }
                        }}
                      />
                      <Label htmlFor={`mod-${type}`} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reversible-mods"
                  checked={formData.modifications?.reversible || false}
                  onCheckedChange={(checked) => updateModificationData({ reversible: checked as boolean })}
                />
                <Label htmlFor="reversible-mods">Modifications are reversible</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="features">Notable Features (comma separated)</Label>
          <Input
            id="features"
            value={(formData.features || []).join(', ')}
            onChange={(e) => {
              const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
              setFormData(prev => ({ ...prev, features }));
            }}
            placeholder="e.g., Leather seats, Sunroof, Navigation, Premium sound"
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        {onSave && (
          <Button type="button" variant="outline" onClick={handleSave} disabled={isLoading}>
            Save Progress
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Complete Valuation'}
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-sm text-gray-500 text-center">
        Completion: {(formData.completion_percentage || 0).toFixed(0)}%
      </div>
    </form>
  );
}
