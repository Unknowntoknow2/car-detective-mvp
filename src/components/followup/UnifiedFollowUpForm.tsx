
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Shield, 
  Car, 
  Settings, 
  FileText,
  Clock,
  Zap
} from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<Partial<FollowUpAnswers>>({
    vin,
    mileage: undefined,
    zip_code: '',
    condition: 'good',
    title_status: 'clean',
    service_history: 'unknown',
    tire_condition: 'good',
    dashboard_lights: [],
    accidents: {
      hadAccident: false,
      severity: 'minor',
      repaired: false,
      description: ''
    },
    modifications: {
      modified: false,
      types: [],
      reversible: true
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const steps = [
    { 
      id: 'basics', 
      title: 'Vehicle Basics', 
      icon: Car,
      description: 'Essential vehicle information',
      color: 'bg-blue-500'
    },
    { 
      id: 'condition', 
      title: 'Condition Assessment', 
      icon: CheckCircle,
      description: 'Current vehicle condition',
      color: 'bg-green-500'
    },
    { 
      id: 'history', 
      title: 'Service & History', 
      icon: FileText,
      description: 'Maintenance and accident history',
      color: 'bg-purple-500'
    },
    { 
      id: 'details', 
      title: 'Additional Details', 
      icon: Settings,
      description: 'Modifications and specifics',
      color: 'bg-orange-500'
    }
  ];

  useEffect(() => {
    // Calculate completion percentage
    const requiredFields = [
      'mileage', 'zip_code', 'condition', 'title_status', 
      'service_history', 'tire_condition'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== '' && value !== null;
    }).length;
    
    const percentage = Math.round((completedFields / requiredFields.length) * 100);
    setCompletionPercentage(percentage);
  }, [formData]);

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const finalData: FollowUpAnswers = {
      vin,
      mileage: formData.mileage || 0,
      zip_code: formData.zip_code || '',
      condition: formData.condition || 'good',
      title_status: formData.title_status || 'clean',
      service_history: formData.service_history || 'unknown',
      tire_condition: formData.tire_condition || 'good',
      dashboard_lights: formData.dashboard_lights || [],
      accidents: formData.accidents || { hadAccident: false },
      modifications: formData.modifications || { modified: false },
      completion_percentage: completionPercentage,
      is_complete: completionPercentage >= 80
    };
    
    onComplete(finalData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basics
        return formData.mileage && formData.zip_code && formData.condition;
      case 1: // Condition
        return formData.title_status && formData.tire_condition;
      case 2: // History
        return formData.service_history && formData.accidents;
      case 3: // Details
        return formData.modifications;
      default:
        return false;
    }
  };

  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Car className="h-5 w-5" />
              Mileage
            </CardTitle>
            <CardDescription>Current odometer reading</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              placeholder="Enter mileage"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
              className="text-lg font-semibold"
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Shield className="h-5 w-5" />
              ZIP Code
            </CardTitle>
            <CardDescription>Vehicle location</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter ZIP code"
              value={formData.zip_code || ''}
              onChange={(e) => updateFormData({ zip_code: e.target.value })}
              className="text-lg font-semibold"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-green-100 bg-green-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <CheckCircle className="h-5 w-5" />
            Overall Condition
          </CardTitle>
          <CardDescription>Select the condition that best describes your vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.condition || 'good'} 
            onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ condition: value })}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: 'excellent', label: 'Excellent', color: 'bg-green-500', description: 'Like new' },
              { value: 'good', label: 'Good', color: 'bg-blue-500', description: 'Minor wear' },
              { value: 'fair', label: 'Fair', color: 'bg-yellow-500', description: 'Some issues' },
              { value: 'poor', label: 'Poor', color: 'bg-red-500', description: 'Needs work' }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={option.value}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                    transition-all duration-200 hover:shadow-md
                    peer-checked:border-primary peer-checked:shadow-lg peer-checked:scale-105
                    ${option.color} text-white
                  `}
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-xs opacity-90">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );

  const renderConditionStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-purple-100 bg-purple-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Shield className="h-5 w-5" />
              Title Status
            </CardTitle>
            <CardDescription>Legal status of the vehicle title</CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.title_status || 'clean'} 
              onValueChange={(value) => updateFormData({ title_status: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clean">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Clean Title
                  </div>
                </SelectItem>
                <SelectItem value="salvage">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Salvage Title
                  </div>
                </SelectItem>
                <SelectItem value="rebuilt">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Rebuilt Title
                  </div>
                </SelectItem>
                <SelectItem value="branded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Branded Title
                  </div>
                </SelectItem>
                <SelectItem value="lemon">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    Lemon Law
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 bg-orange-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Wrench className="h-5 w-5" />
              Tire Condition
            </CardTitle>
            <CardDescription>Current state of all tires</CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.tire_condition || 'good'} 
              onValueChange={(value) => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Excellent (8/32"+ tread)
                  </div>
                </SelectItem>
                <SelectItem value="good">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Good (6-7/32")
                  </div>
                </SelectItem>
                <SelectItem value="worn">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Worn (3-5/32")
                  </div>
                </SelectItem>
                <SelectItem value="replacement">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Needs Replacement (&lt;3/32")
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-red-100 bg-red-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Dashboard Warning Lights
          </CardTitle>
          <CardDescription>Select any active warning lights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { value: 'check_engine', label: 'Check Engine', icon: '⚠️' },
              { value: 'abs', label: 'ABS', icon: '🛑' },
              { value: 'tire_pressure', label: 'Tire Pressure', icon: '🛞' },
              { value: 'oil', label: 'Oil', icon: '🛢️' },
              { value: 'battery', label: 'Battery', icon: '🔋' },
              { value: 'none', label: 'None', icon: '✅' }
            ].map((light) => (
              <div key={light.value} className="flex items-center space-x-2">
                <Checkbox
                  id={light.value}
                  checked={formData.dashboard_lights?.includes(light.value) || false}
                  onCheckedChange={(checked) => {
                    const currentLights = formData.dashboard_lights || [];
                    if (checked) {
                      updateFormData({ 
                        dashboard_lights: [...currentLights.filter(l => l !== 'none'), light.value]
                      });
                    } else {
                      updateFormData({ 
                        dashboard_lights: currentLights.filter(l => l !== light.value)
                      });
                    }
                  }}
                />
                <Label htmlFor={light.value} className="flex items-center gap-2 cursor-pointer">
                  <span>{light.icon}</span>
                  {light.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistoryStep = () => (
    <div className="space-y-6">
      <Card className="border-2 border-green-100 bg-green-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <FileText className="h-5 w-5" />
            Service History
          </CardTitle>
          <CardDescription>How has the vehicle been maintained?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.service_history || 'unknown'} 
            onValueChange={(value) => updateFormData({ service_history: value })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              { value: 'dealer', label: 'Dealer Maintained', description: 'Professional service', color: 'bg-green-500' },
              { value: 'independent', label: 'Independent Shop', description: 'Qualified mechanics', color: 'bg-blue-500' },
              { value: 'owner', label: 'Owner Maintained', description: 'Self-serviced', color: 'bg-yellow-500' },
              { value: 'unknown', label: 'Unknown History', description: 'No records', color: 'bg-gray-500' }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem 
                  value={option.value} 
                  id={`service-${option.value}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`service-${option.value}`}
                  className={`
                    flex flex-col p-4 rounded-lg border-2 cursor-pointer
                    transition-all duration-200 hover:shadow-md
                    peer-checked:border-primary peer-checked:shadow-lg peer-checked:scale-105
                    ${option.color} text-white
                  `}
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-xs opacity-90">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-2 border-red-100 bg-red-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Accident History
          </CardTitle>
          <CardDescription>Has this vehicle been in any accidents?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup 
            value={formData.accidents?.hadAccident ? 'yes' : 'no'} 
            onValueChange={(value) => updateFormData({ 
              accidents: { 
                ...formData.accidents,
                hadAccident: value === 'yes',
                severity: 'minor',
                repaired: false,
                description: ''
              }
            })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident" className="font-medium">No accidents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident" className="font-medium">Yes, there were accidents</Label>
            </div>
          </RadioGroup>

          {formData.accidents?.hadAccident && (
            <div className="space-y-4 mt-4 p-4 bg-yellow-50 rounded-lg border">
              <div>
                <Label className="text-sm font-medium">Severity Level</Label>
                <Select 
                  value={formData.accidents?.severity || 'minor'} 
                  onValueChange={(value: 'minor' | 'moderate' | 'major') => updateFormData({ 
                    accidents: { ...formData.accidents, hadAccident: true, severity: value }
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                    <SelectItem value="moderate">Moderate (functional damage)</SelectItem>
                    <SelectItem value="major">Major (structural damage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="repaired"
                  checked={formData.accidents?.repaired || false}
                  onCheckedChange={(checked) => updateFormData({ 
                    accidents: { ...formData.accidents, hadAccident: true, repaired: !!checked }
                  })}
                />
                <Label htmlFor="repaired">Professionally repaired</Label>
              </div>

              <div>
                <Label className="text-sm font-medium">Description (optional)</Label>
                <Textarea
                  placeholder="Describe the accident and repairs..."
                  value={formData.accidents?.description || ''}
                  onChange={(e) => updateFormData({ 
                    accidents: { ...formData.accidents, hadAccident: true, description: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <Card className="border-2 border-blue-100 bg-blue-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Settings className="h-5 w-5" />
            Vehicle Modifications
          </CardTitle>
          <CardDescription>Any aftermarket modifications or upgrades?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup 
            value={formData.modifications?.modified ? 'yes' : 'no'} 
            onValueChange={(value) => updateFormData({ 
              modifications: { 
                modified: value === 'yes',
                types: [],
                reversible: true
              }
            })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-mods" />
              <Label htmlFor="no-mods" className="font-medium">Stock/Original</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-mods" />
              <Label htmlFor="yes-mods" className="font-medium">Modified</Label>
            </div>
          </RadioGroup>

          {formData.modifications?.modified && (
            <div className="space-y-4 mt-4 p-4 bg-blue-50 rounded-lg border">
              <div>
                <Label className="text-sm font-medium">Modification Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {[
                    'Performance Tune', 'Exhaust System', 'Suspension', 'Wheels/Tires',
                    'Audio System', 'Interior Mods', 'Exterior Styling', 'Lighting',
                    'Engine Mods', 'Other'
                  ].map((mod) => (
                    <div key={mod} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mod-${mod}`}
                        checked={formData.modifications?.types?.includes(mod) || false}
                        onCheckedChange={(checked) => {
                          const currentTypes = formData.modifications?.types || [];
                          const newTypes = checked 
                            ? [...currentTypes, mod]
                            : currentTypes.filter(t => t !== mod);
                          updateFormData({ 
                            modifications: { 
                              ...formData.modifications, 
                              modified: true, 
                              types: newTypes 
                            }
                          });
                        }}
                      />
                      <Label htmlFor={`mod-${mod}`} className="text-sm">{mod}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reversible"
                  checked={formData.modifications?.reversible || false}
                  onCheckedChange={(checked) => updateFormData({ 
                    modifications: { 
                      ...formData.modifications, 
                      modified: true, 
                      reversible: !!checked 
                    }
                  })}
                />
                <Label htmlFor="reversible">Modifications are reversible</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-green-100 bg-green-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Zap className="h-5 w-5" />
            Completion Summary
          </CardTitle>
          <CardDescription>Review your valuation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Form Completion</span>
              <Badge variant={completionPercentage >= 80 ? "default" : "secondary"}>
                {completionPercentage}%
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            {completionPercentage >= 80 && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Ready for valuation!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicsStep();
      case 1: return renderConditionStep();
      case 2: return renderHistoryStep();
      case 3: return renderDetailsStep();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with Progress */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Valuation Assessment</h1>
        <p className="text-gray-600">Complete the assessment to get your accurate valuation</p>
        
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <div className="flex items-center gap-3">
            <Progress value={(currentStep + 1) / steps.length * 100} className="w-32 h-2" />
            <Badge variant="outline">{currentStep + 1} of {steps.length}</Badge>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center space-y-2 flex-1">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                ${isActive ? `${step.color} text-white shadow-lg scale-110` : 
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {isCompleted ? <CheckCircle className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-full h-0.5 mt-6 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                } transition-colors duration-200`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={completionPercentage < 50}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle className="h-5 w-5" />
              Complete Valuation
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
              size="lg"
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
