import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
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
import { saveFollowUpAnswers, loadFollowUpAnswers } from '@/services/followUpService';
import { toast } from 'sonner';
import { Car, AlertTriangle, Wrench, FileText, Settings, Gauge } from 'lucide-react';

export interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void | Promise<void>;
}

export const UnifiedFollowUpForm: React.FC<UnifiedFollowUpFormProps> = ({ vin, onComplete }) => {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: vin,
    mileage: undefined,
    zip_code: '',
    condition: undefined,
    exterior_condition: undefined,
    interior_condition: undefined,
    accidents: {
      hadAccident: false,
      count: undefined,
      location: undefined,
      severity: undefined,
      repaired: undefined,
      frameDamage: undefined,
      description: undefined
    },
    service_history: undefined,
    maintenance_status: undefined,
    last_service_date: undefined,
    title_status: undefined,
    previous_owners: undefined,
    previous_use: undefined,
    tire_condition: undefined,
    dashboard_lights: [],
    frame_damage: undefined,
    modifications: {
      modified: false,
      types: [],
      reversible: undefined
    },
    features: [],
    completion_percentage: 0,
    is_complete: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing answers on component mount
  useEffect(() => {
    const loadExistingAnswers = async () => {
      try {
        const existingAnswers = await loadFollowUpAnswers(vin);
        if (existingAnswers) {
          setFormData(prev => ({
            ...prev,
            ...existingAnswers,
            vin: vin // Ensure VIN is set correctly
          }));
          console.log('✅ Loaded existing follow-up answers:', existingAnswers);
        }
      } catch (error) {
        console.error('❌ Error loading existing answers:', error);
      }
    };

    if (vin) {
      loadExistingAnswers();
    }
  }, [vin]);

  // Auto-save functionality
  const autoSave = async (updatedData: FollowUpAnswers) => {
    if (!isSaving) {
      setIsSaving(true);
      try {
        await saveFollowUpAnswers(updatedData);
        console.log('💾 Auto-saved follow-up answers');
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = (data: FollowUpAnswers): number => {
    const fields = [
      data.mileage,
      data.zip_code,
      data.condition,
      data.exterior_condition,
      data.interior_condition,
      data.accidents?.hadAccident !== undefined,
      data.service_history,
      data.maintenance_status,
      data.title_status,
      data.previous_owners,
      data.previous_use,
      data.tire_condition,
      data.dashboard_lights && data.dashboard_lights.length > 0,
      data.frame_damage !== undefined,
      data.modifications?.modified !== undefined
    ];
    
    const completedFields = fields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  // Update form data with auto-save and completion tracking
  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates, updated_at: new Date().toISOString() };
      const completionPercentage = calculateCompletionPercentage(newData);
      const finalData = {
        ...newData,
        completion_percentage: completionPercentage,
        is_complete: completionPercentage >= 80
      };
      
      // Auto-save after a short delay
      setTimeout(() => autoSave(finalData), 1000);
      
      return finalData;
    });
  };

  // Handle accident details
  const handleAccidentChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        [field]: value,
        // Reset dependent fields when hadAccident changes
        ...(field === 'hadAccident' && !value ? {
          count: undefined,
          location: undefined,
          severity: undefined,
          repaired: undefined,
          frameDamage: undefined,
          description: undefined
        } : {})
      },
      updated_at: new Date().toISOString()
    }));
  };

  // Handle modifications
  const handleModificationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        [field]: value,
        // Reset types when modified changes to false
        ...(field === 'modified' && !value ? { types: [] } : {})
      },
      updated_at: new Date().toISOString()
    }));
  };

  // Handle modification types
  const handleModificationTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        types: checked 
          ? [...(prev.modifications?.types || []), type]
          : (prev.modifications?.types || []).filter(t => t !== type)
      },
      updated_at: new Date().toISOString()
    }));
  };

  // Handle dashboard lights
  const handleDashboardLightChange = (light: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dashboard_lights: checked
        ? [...(prev.dashboard_lights || []), light]
        : (prev.dashboard_lights || []).filter(l => l !== light),
      updated_at: new Date().toISOString()
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const finalData = {
        ...formData,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString()
      };

      await saveFollowUpAnswers(finalData);
      await onComplete(finalData);
      
      toast.success('Follow-up information completed successfully!');
    } catch (error) {
      console.error('❌ Error completing follow-up:', error);
      toast.error('Failed to complete follow-up information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Progress</span>
            <span className="text-sm text-muted-foreground">{formData.completion_percentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${formData.completion_percentage || 0}%` }}
            />
          </div>
          {isSaving && (
            <p className="text-xs text-muted-foreground mt-2">Saving...</p>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Basic Information
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
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
                placeholder="Enter vehicle mileage"
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code || ''}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                placeholder="Enter ZIP code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="condition">Overall Condition</Label>
              <Select 
                value={formData.condition || ''} 
                onValueChange={(value) => updateFormData({ condition: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select overall condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.impact}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="exterior_condition">Exterior Condition</Label>
              <Select 
                value={formData.exterior_condition || ''} 
                onValueChange={(value) => updateFormData({ exterior_condition: value as any })}
              >
                <SelectTrigger>
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

            <div>
              <Label htmlFor="interior_condition">Interior Condition</Label>
              <Select 
                value={formData.interior_condition || ''} 
                onValueChange={(value) => updateFormData({ interior_condition: value as any })}
              >
                <SelectTrigger>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hadAccident"
              checked={formData.accidents?.hadAccident || false}
              onCheckedChange={(checked) => handleAccidentChange('hadAccident', checked)}
            />
            <Label htmlFor="hadAccident">Has this vehicle been in an accident?</Label>
          </div>

          {formData.accidents?.hadAccident && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accidentCount">Number of Accidents</Label>
                  <Input
                    id="accidentCount"
                    type="number"
                    min="1"
                    value={formData.accidents?.count || ''}
                    onChange={(e) => handleAccidentChange('count', parseInt(e.target.value) || undefined)}
                    placeholder="Enter number of accidents"
                  />
                </div>
                <div>
                  <Label htmlFor="accidentLocation">Location of Damage</Label>
                  <Select 
                    value={formData.accidents?.location || ''} 
                    onValueChange={(value) => handleAccidentChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select damage location" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accidentSeverity">Severity</Label>
                  <Select 
                    value={formData.accidents?.severity || ''} 
                    onValueChange={(value) => handleAccidentChange('severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="repaired"
                    checked={formData.accidents?.repaired || false}
                    onCheckedChange={(checked) => handleAccidentChange('repaired', checked)}
                  />
                  <Label htmlFor="repaired">Repaired professionally?</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="frameDamage"
                  checked={formData.accidents?.frameDamage || false}
                  onCheckedChange={(checked) => handleAccidentChange('frameDamage', checked)}
                />
                <Label htmlFor="frameDamage">Frame damage?</Label>
              </div>

              <div>
                <Label htmlFor="accidentDescription">Description (Optional)</Label>
                <Textarea
                  id="accidentDescription"
                  value={formData.accidents?.description || ''}
                  onChange={(e) => handleAccidentChange('description', e.target.value)}
                  placeholder="Describe the accident and any other relevant details..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service & Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Service & Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_history">Service History</Label>
              <Select 
                value={formData.service_history || ''} 
                onValueChange={(value) => updateFormData({ service_history: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service history" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_HISTORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.impact}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maintenance_status">Maintenance Status</Label>
              <Select 
                value={formData.maintenance_status || ''} 
                onValueChange={(value) => updateFormData({ maintenance_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance status" />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="last_service_date">Last Service Date (Optional)</Label>
            <Input
              id="last_service_date"
              type="date"
              value={formData.last_service_date || ''}
              onChange={(e) => updateFormData({ last_service_date: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Title & Ownership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Title & Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title_status">Title Status</Label>
              <Select 
                value={formData.title_status || ''} 
                onValueChange={(value) => updateFormData({ title_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title status" />
                </SelectTrigger>
                <SelectContent>
                  {TITLE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.impact}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="previous_owners">Previous Owners</Label>
              <Input
                id="previous_owners"
                type="number"
                min="0"
                value={formData.previous_owners || ''}
                onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || undefined })}
                placeholder="Number of previous owners"
              />
            </div>
            <div>
              <Label htmlFor="previous_use">Previous Use</Label>
              <Select 
                value={formData.previous_use || ''} 
                onValueChange={(value) => updateFormData({ previous_use: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select previous use" />
                </SelectTrigger>
                <SelectContent>
                  {PREVIOUS_USE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.impact}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Physical Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tire_condition">Tire Condition</Label>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value) => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                {TIRE_CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.impact}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dashboard Warning Lights</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {DASHBOARD_LIGHTS.map((light) => (
                <div key={light.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={light.value}
                    checked={formData.dashboard_lights?.includes(light.value) || false}
                    onCheckedChange={(checked) => handleDashboardLightChange(light.value, checked as boolean)}
                  />
                  <Label htmlFor={light.value} className="text-sm">
                    {light.icon} {light.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="frame_damage"
              checked={formData.frame_damage || false}
              onCheckedChange={(checked) => updateFormData({ frame_damage: checked as boolean })}
            />
            <Label htmlFor="frame_damage">Frame damage present?</Label>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="modified"
              checked={formData.modifications?.modified || false}
              onCheckedChange={(checked) => handleModificationChange('modified', checked)}
            />
            <Label htmlFor="modified">Has this vehicle been modified?</Label>
          </div>

          {formData.modifications?.modified && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <Label>Types of Modifications</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {MODIFICATION_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mod-${type}`}
                        checked={formData.modifications?.types?.includes(type) || false}
                        onCheckedChange={(checked) => handleModificationTypeChange(type, checked as boolean)}
                      />
                      <Label htmlFor={`mod-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reversible"
                  checked={formData.modifications?.reversible || false}
                  disabled={!formData.modifications?.modified}
                  onCheckedChange={(checked) => handleModificationChange('reversible', checked)}
                />
                <Label htmlFor="reversible">Are modifications reversible?</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (formData.completion_percentage || 0) < 50}
          className="px-8"
        >
          {isLoading ? 'Completing...' : 'Complete Valuation'}
        </Button>
      </div>

      {(formData.completion_percentage || 0) < 50 && (
        <p className="text-sm text-muted-foreground text-center">
          Complete at least 50% of the form to proceed with valuation
        </p>
      )}
    </div>
  );
};
