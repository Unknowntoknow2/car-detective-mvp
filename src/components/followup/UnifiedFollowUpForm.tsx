
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Car, FileText, AlertTriangle, Star, Activity, Check } from 'lucide-react';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (data: FollowUpAnswers) => void;
}

type FormStep = 'basic' | 'accidents' | 'service' | 'features' | 'condition' | 'review';

const STEPS: { id: FormStep; title: string; icon: React.ElementType; description: string }[] = [
  { id: 'basic', title: 'Basic Info', icon: Car, description: 'Vehicle mileage and location' },
  { id: 'accidents', title: 'Accident History', icon: AlertTriangle, description: 'Any accidents or damage' },
  { id: 'service', title: 'Service History', icon: FileText, description: 'Maintenance and service records' },
  { id: 'features', title: 'Vehicle Features', icon: Star, description: 'Premium features and options' },
  { id: 'condition', title: 'Current Condition', icon: Activity, description: 'Overall condition assessment' },
  { id: 'review', title: 'Review & Submit', icon: Check, description: 'Review all information' }
];

// Vehicle features with their value impacts
const VEHICLE_FEATURES = [
  { id: 'leather_seats', name: 'Leather Seats', category: 'Interior', value: 1200 },
  { id: 'sunroof', name: 'Sunroof/Moonroof', category: 'Exterior', value: 800 },
  { id: 'navigation', name: 'Navigation System', category: 'Technology', value: 600 },
  { id: 'heated_seats', name: 'Heated Seats', category: 'Comfort', value: 500 },
  { id: 'bluetooth', name: 'Bluetooth', category: 'Technology', value: 200 },
  { id: 'backup_camera', name: 'Backup Camera', category: 'Safety', value: 400 },
  { id: 'remote_start', name: 'Remote Start', category: 'Convenience', value: 300 },
  { id: 'third_row', name: 'Third Row Seating', category: 'Capacity', value: 1000 },
  { id: 'blind_spot', name: 'Blind Spot Monitoring', category: 'Safety', value: 600 },
  { id: 'carplay', name: 'Apple CarPlay/Android Auto', category: 'Technology', value: 400 },
  { id: 'lane_departure', name: 'Lane Departure Warning', category: 'Safety', value: 500 },
  { id: 'keyless_entry', name: 'Keyless Entry', category: 'Convenience', value: 250 },
  { id: 'adaptive_cruise', name: 'Adaptive Cruise Control', category: 'Safety', value: 800 },
  { id: 'premium_audio', name: 'Premium Audio System', category: 'Technology', value: 700 },
  { id: 'parking_sensors', name: 'Parking Sensors', category: 'Safety', value: 350 },
  { id: 'panoramic_roof', name: 'Panoramic Roof', category: 'Exterior', value: 1200 }
];

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [formData, setFormData] = useState<Partial<FollowUpAnswers>>({
    vin,
    mileage: undefined,
    zip_code: '',
    condition: 'good',
    service_history: 'unknown',
    accidents: { hadAccident: false },
    title_status: 'clean',
    previous_owners: 1,
    previous_use: 'personal',
    tire_condition: 'good',
    dashboard_lights: [],
    modifications: { modified: false, types: [] }
  });
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getCurrentStepIndex = () => STEPS.findIndex(step => step.id === currentStep);
  const getProgress = () => ((getCurrentStepIndex() + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'basic':
        return formData.mileage && formData.mileage > 0 && formData.zip_code && formData.zip_code.length === 5;
      case 'accidents':
        return formData.accidents !== undefined;
      case 'service':
        return formData.service_history !== undefined;
      case 'features':
        return true; // Features are optional
      case 'condition':
        return formData.condition !== undefined;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!canProceed()) {
      toast.error('Please complete all required fields before proceeding');
      return;
    }
    
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    const finalData: FollowUpAnswers = {
      ...formData,
      vin,
      completion_percentage: 100,
      is_complete: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as FollowUpAnswers;

    onComplete(finalData);
  };

  const getFeaturesValue = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = VEHICLE_FEATURES.find(f => f.id === featureId);
      return total + (feature?.value || 0);
    }, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="mileage">Current Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
                placeholder="Enter current mileage"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="zip-code">ZIP Code *</Label>
              <Input
                id="zip-code"
                value={formData.zip_code || ''}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                placeholder="Enter 5-digit ZIP code"
                maxLength={5}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'accidents':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Has this vehicle been in any accidents?</Label>
              <div className="flex gap-4 mt-4">
                <Button
                  type="button"
                  variant={formData.accidents?.hadAccident === false ? "default" : "outline"}
                  onClick={() => updateFormData({ 
                    accidents: { hadAccident: false } 
                  })}
                  className="flex-1"
                >
                  No Accidents
                </Button>
                <Button
                  type="button"
                  variant={formData.accidents?.hadAccident === true ? "default" : "outline"}
                  onClick={() => updateFormData({ 
                    accidents: { hadAccident: true, count: 1, severity: 'minor' } 
                  })}
                  className="flex-1"
                >
                  Yes, Has Accidents
                </Button>
              </div>
            </div>

            {formData.accidents?.hadAccident && (
              <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <Label htmlFor="accident-count">Number of Accidents</Label>
                  <Input
                    id="accident-count"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.accidents?.count || 1}
                    onChange={(e) => updateFormData({
                      accidents: { 
                        ...formData.accidents!, 
                        count: parseInt(e.target.value) || 1 
                      }
                    })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="accident-severity">Severity of Most Recent Accident</Label>
                  <Select 
                    value={formData.accidents?.severity || 'minor'} 
                    onValueChange={(value: 'minor' | 'moderate' | 'major') => 
                      updateFormData({
                        accidents: { 
                          ...formData.accidents!, 
                          severity: value 
                        }
                      })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                      <SelectItem value="moderate">Moderate (some structural damage)</SelectItem>
                      <SelectItem value="major">Major (significant structural damage)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Was the damage properly repaired?</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={formData.accidents?.repaired === true ? "default" : "outline"}
                      onClick={() => updateFormData({
                        accidents: { ...formData.accidents!, repaired: true }
                      })}
                    >
                      Yes, Fully Repaired
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={formData.accidents?.repaired === false ? "default" : "outline"}
                      onClick={() => updateFormData({
                        accidents: { ...formData.accidents!, repaired: false }
                      })}
                    >
                      No / Partially Repaired
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="accident-description">Additional Details (Optional)</Label>
                  <Textarea
                    id="accident-description"
                    value={formData.accidents?.description || ''}
                    onChange={(e) => updateFormData({
                      accidents: { 
                        ...formData.accidents!, 
                        description: e.target.value 
                      }
                    })}
                    placeholder="Describe the accident and any relevant details"
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'service':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Service History</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How has the vehicle been maintained?
              </p>
              
              <div className="grid gap-3">
                {SERVICE_HISTORY_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => updateFormData({ service_history: option.value })}
                    className={`
                      cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md
                      ${formData.service_history === option.value 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{option.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{option.impact}</p>
                      </div>
                      <Badge variant={formData.service_history === option.value ? 'default' : 'secondary'}>
                        {option.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="maintenance-notes">Maintenance Notes (Optional)</Label>
              <Textarea
                id="maintenance-notes"
                value={formData.maintenance_status || ''}
                onChange={(e) => updateFormData({ maintenance_status: e.target.value })}
                placeholder="Any specific maintenance details, recent services, or upcoming needs"
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Vehicle Features</h3>
                <p className="text-sm text-muted-foreground">
                  Select all features your vehicle has
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Added Value</div>
                <div className="text-2xl font-bold text-green-600">
                  ${getFeaturesValue().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VEHICLE_FEATURES.map((feature) => {
                const isSelected = selectedFeatures.includes(feature.id);
                return (
                  <div
                    key={feature.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedFeatures(prev => prev.filter(id => id !== feature.id));
                      } else {
                        setSelectedFeatures(prev => [...prev, feature.id]);
                      }
                    }}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox checked={isSelected} />
                      <div>
                        <span className="text-sm font-medium">{feature.name}</span>
                        <div className="text-xs text-muted-foreground">{feature.category}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +${feature.value}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Overall Vehicle Condition</Label>
              <p className="text-sm text-muted-foreground mb-4">
                What best describes your vehicle's current condition?
              </p>
              
              <div className="grid gap-3">
                {CONDITION_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => updateFormData({ condition: option.value })}
                    className={`
                      cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md
                      ${formData.condition === option.value 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{option.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      </div>
                      <Badge variant={formData.condition === option.value ? 'default' : 'secondary'}>
                        {option.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium">Tire Condition</Label>
              <Select 
                value={formData.tire_condition || 'good'} 
                onValueChange={(value: any) => updateFormData({ tire_condition: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIRE_CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.impact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-lg font-medium">Dashboard Warning Lights</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select any warning lights currently on
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DASHBOARD_LIGHTS.map((light) => {
                  const isSelected = formData.dashboard_lights?.includes(light.value) || false;
                  return (
                    <div
                      key={light.value}
                      onClick={() => {
                        const current = formData.dashboard_lights || [];
                        if (isSelected) {
                          updateFormData({ 
                            dashboard_lights: current.filter(l => l !== light.value) 
                          });
                        } else {
                          updateFormData({ 
                            dashboard_lights: [...current, light.value] 
                          });
                        }
                      }}
                      className={`
                        flex items-center space-x-2 p-2 rounded border cursor-pointer transition-all
                        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <Checkbox checked={isSelected} />
                      <span className="text-sm">{light.icon} {light.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Review Your Information</h3>
            
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Basic Information</h4>
                <p>Mileage: {formData.mileage?.toLocaleString()} miles</p>
                <p>ZIP Code: {formData.zip_code}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Accident History</h4>
                <p>{formData.accidents?.hadAccident ? `${formData.accidents.count} accident(s) - ${formData.accidents.severity} severity` : 'No accidents reported'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Service History</h4>
                <p>{SERVICE_HISTORY_OPTIONS.find(opt => opt.value === formData.service_history)?.label || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Features</h4>
                <p>{selectedFeatures.length} features selected (+${getFeaturesValue().toLocaleString()} value)</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Condition</h4>
                <p>{CONDITION_OPTIONS.find(opt => opt.value === formData.condition)?.label || 'Not specified'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = STEPS.find(step => step.id === currentStep);
  const StepIcon = currentStepData?.icon || Car;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-4">
          <StepIcon className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>{currentStepData?.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentStepData?.description}</p>
          </div>
        </div>
        
        <Progress value={getProgress()} className="mb-4" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {getCurrentStepIndex() + 1} of {STEPS.length}</span>
          <span>{Math.round(getProgress())}% Complete</span>
        </div>
      </CardHeader>

      <CardContent>
        {renderStepContent()}
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={getCurrentStepIndex() === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          {currentStep === 'review' ? (
            <Button onClick={handleSubmit} className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>Complete Valuation</span>
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
