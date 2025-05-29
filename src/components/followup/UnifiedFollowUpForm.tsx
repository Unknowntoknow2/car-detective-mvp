import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FollowUpAnswers, 
  CONDITION_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  MAINTENANCE_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  DASHBOARD_LIGHTS,
  MODIFICATION_TYPES
} from '@/types/follow-up-answers';
import { Car, Wrench, Shield, Gauge, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: 0,
    zip_code: '',
    condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    accidents: {
      hadAccident: false, // Provide default value
    },
    service_history: 'unknown',
    maintenance_status: 'Unknown',
    title_status: 'clean',
    previous_owners: 1,
    previous_use: 'personal',
    tire_condition: 'good',
    dashboard_lights: [],
    frame_damage: false,
    modifications: {
      modified: false, // Provide default value
      types: [],
      reversible: true,
    },
    features: [],
    completion_percentage: 0,
    is_complete: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    // Calculate completion percentage
    const totalFields = 17; // Total number of fields to consider
    let completedFields = 0;

    if (formData.mileage) completedFields++;
    if (formData.zip_code) completedFields++;
    if (formData.condition) completedFields++;
    if (formData.exterior_condition) completedFields++;
    if (formData.interior_condition) completedFields++;
    if (formData.accidents) {
      if (formData.accidents.hadAccident !== undefined) completedFields++;
    }
    if (formData.service_history) completedFields++;
    if (formData.maintenance_status) completedFields++;
    if (formData.title_status) completedFields++;
    if (formData.previous_owners) completedFields++;
    if (formData.previous_use) completedFields++;
    if (formData.tire_condition) completedFields++;
    if (formData.dashboard_lights && formData.dashboard_lights.length > 0) completedFields++;
    if (formData.frame_damage !== undefined) completedFields++;
    if (formData.modifications) {
      if (formData.modifications.modified !== undefined) completedFields++;
    }
    if (formData.features && formData.features.length > 0) completedFields++;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setFormData(prev => ({ ...prev, completion_percentage: percentage }));
  }, [formData]);

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.mileage || !formData.zip_code || !formData.condition) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Mark as complete and submit
    setFormData(prev => ({ ...prev, is_complete: true }));
    toast.success('Follow-up data submitted successfully!');
    onComplete(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleAccidentChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        [field]: value,
        hadAccident: field === 'hadAccident' ? value : (prev.accidents?.hadAccident ?? false), // Ensure boolean
      },
      updated_at: new Date().toISOString(),
    }));
  };

  const handleModificationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        [field]: value,
        modified: field === 'modified' ? value : (prev.modifications?.modified ?? false), // Ensure boolean
      },
      updated_at: new Date().toISOString(),
    }));
  };

  const handleModificationTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        types: prev.modifications?.types?.includes(type) 
          ? prev.modifications.types.filter(t => t !== type)
          : [...(prev.modifications?.types || []), type],
        modified: prev.modifications?.modified ?? false, // Ensure boolean
      },
      updated_at: new Date().toISOString(),
    }));
  };

  const handleDashboardLightsChange = (light: string) => {
    setFormData(prev => {
      const currentLights = prev.dashboard_lights || [];
      const isSelected = currentLights.includes(light);

      const updatedLights = isSelected
        ? currentLights.filter(l => l !== light)
        : [...currentLights, light];

      return {
        ...prev,
        dashboard_lights: updatedLights,
        updated_at: new Date().toISOString(),
      };
    });
  };

  const handleFeaturesChange = (feature: string) => {
    setFormData(prev => {
      const currentFeatures = prev.features || [];
      const isSelected = currentFeatures.includes(feature);

      const updatedFeatures = isSelected
        ? currentFeatures.filter(f => f !== feature)
        : [...currentFeatures, feature];

      return {
        ...prev,
        features: updatedFeatures,
        updated_at: new Date().toISOString(),
      };
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Progress Indicator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Completion</Label>
            <span className="text-sm text-muted-foreground">{formData.completion_percentage}%</span>
          </div>
          <Progress value={formData.completion_percentage} />
        </div>

        {/* VIN Display */}
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input id="vin" name="vin" value={formData.vin} readOnly />
        </div>

        {/* Mileage Input */}
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            placeholder="Enter mileage"
            value={String(formData.mileage)}
            onChange={handleChange}
          />
        </div>

        {/* Zip Code Input */}
        <div className="space-y-2">
          <Label htmlFor="zip_code">Zip Code</Label>
          <Input
            id="zip_code"
            name="zip_code"
            type="text"
            placeholder="Enter zip code"
            value={formData.zip_code}
            onChange={handleChange}
          />
        </div>

        {/* Condition Select */}
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select onValueChange={(value) => handleSelectChange('condition', value)}>
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Exterior Condition Select */}
        <div className="space-y-2">
          <Label htmlFor="exterior_condition">Exterior Condition</Label>
          <Select onValueChange={(value) => handleSelectChange('exterior_condition', value)}>
            <SelectTrigger id="exterior_condition">
              <SelectValue placeholder="Select exterior condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interior Condition Select */}
        <div className="space-y-2">
          <Label htmlFor="interior_condition">Interior Condition</Label>
          <Select onValueChange={(value) => handleSelectChange('interior_condition', value)}>
            <SelectTrigger id="interior_condition">
              <SelectValue placeholder="Select interior condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accident History */}
        <div className="space-y-3 border rounded-md p-4">
          <Label className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Accident History</span>
          </Label>
          <RadioGroup onValueChange={(value) => handleAccidentChange('hadAccident', value === 'true')} defaultValue={String(formData.accidents?.hadAccident)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="accident-yes" />
              <Label htmlFor="accident-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="accident-no" />
              <Label htmlFor="accident-no">No</Label>
            </div>
          </RadioGroup>
          {formData.accidents?.hadAccident && (
            <div className="mt-2">
              <Label htmlFor="accident-description">Accident Description</Label>
              <Textarea
                id="accident-description"
                placeholder="Describe the accident"
                value={formData.accidents?.description || ''}
                onChange={(e) => handleAccidentChange('description', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Service History */}
        <div className="space-y-2">
          <Label htmlFor="service_history">Service History</Label>
          <Select onValueChange={(value) => handleSelectChange('service_history', value)}>
            <SelectTrigger id="service_history">
              <SelectValue placeholder="Select service history" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_HISTORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Maintenance Status */}
        <div className="space-y-2">
          <Label htmlFor="maintenance_status">Maintenance Status</Label>
          <Select onValueChange={(value) => handleSelectChange('maintenance_status', value)}>
            <SelectTrigger id="maintenance_status">
              <SelectValue placeholder="Select maintenance status" />
            </SelectTrigger>
            <SelectContent>
              {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title Status */}
        <div className="space-y-2">
          <Label htmlFor="title_status">Title Status</Label>
          <Select onValueChange={(value) => handleSelectChange('title_status', value)}>
            <SelectTrigger id="title_status">
              <SelectValue placeholder="Select title status" />
            </SelectTrigger>
            <SelectContent>
              {TITLE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Previous Owners */}
        <div className="space-y-2">
          <Label htmlFor="previous_owners">Previous Owners</Label>
          <Input
            id="previous_owners"
            name="previous_owners"
            type="number"
            placeholder="Enter number of previous owners"
            value={String(formData.previous_owners)}
            onChange={handleChange}
          />
        </div>

        {/* Previous Use */}
        <div className="space-y-2">
          <Label htmlFor="previous_use">Previous Use</Label>
          <Select onValueChange={(value) => handleSelectChange('previous_use', value)}>
            <SelectTrigger id="previous_use">
              <SelectValue placeholder="Select previous use" />
            </SelectTrigger>
            <SelectContent>
              {PREVIOUS_USE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tire Condition */}
        <div className="space-y-2">
          <Label htmlFor="tire_condition">Tire Condition</Label>
          <Select onValueChange={(value) => handleSelectChange('tire_condition', value)}>
            <SelectTrigger id="tire_condition">
              <SelectValue placeholder="Select tire condition" />
            </SelectTrigger>
            <SelectContent>
              {TIRE_CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dashboard Lights */}
        <div className="space-y-3 border rounded-md p-4">
          <Label className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Dashboard Lights</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DASHBOARD_LIGHTS.map((light) => (
              <div key={light.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`dashboard-light-${light.value}`}
                  checked={formData.dashboard_lights?.includes(light.value)}
                  onCheckedChange={() => handleDashboardLightsChange(light.value)}
                />
                <Label htmlFor={`dashboard-light-${light.value}`}>{light.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Frame Damage */}
        <div className="space-y-3 border rounded-md p-4">
          <Label className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Frame Damage</span>
          </Label>
          <RadioGroup onValueChange={(value) => setFormData(prev => ({ ...prev, frame_damage: value === 'true' }))} defaultValue={String(formData.frame_damage)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="frame-damage-yes" />
              <Label htmlFor="frame-damage-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="frame-damage-no" />
              <Label htmlFor="frame-damage-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Modifications */}
        <div className="space-y-3 border rounded-md p-4">
          <Label className="flex items-center space-x-2">
            <Car className="h-4 w-4" />
            <span>Modifications</span>
          </Label>
          <RadioGroup onValueChange={(value) => handleModificationChange('modified', value === 'true')} defaultValue={String(formData.modifications?.modified)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="modifications-yes" />
              <Label htmlFor="modifications-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="modifications-no" />
              <Label htmlFor="modifications-no">No</Label>
            </div>
          </RadioGroup>

          {formData.modifications?.modified && (
            <div className="mt-2 space-y-2">
              <Label>Modification Types</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MODIFICATION_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`modification-type-${type}`}
                      checked={formData.modifications?.types?.includes(type)}
                      onCheckedChange={() => handleModificationTypeToggle(type)}
                    />
                    <Label htmlFor={`modification-type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 border rounded-md p-4">
          <Label className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Features</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Sunroof", "Leather Seats", "Navigation System", "Premium Audio", "Heated Seats", "Cooled Seats"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={formData.features?.includes(feature)}
                  onCheckedChange={() => handleFeaturesChange(feature)}
                />
                <Label htmlFor={`feature-${feature}`}>{feature}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit}>Submit</Button>
      </CardContent>
    </Card>
  );
}
