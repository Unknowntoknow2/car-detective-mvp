
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Car, 
  Shield, 
  Wrench, 
  Star,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Zap,
  Sun,
  Navigation
} from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

interface AccidentDetail {
  date: string;
  location: string;
  severity: 'minor' | 'moderate' | 'major';
  repaired: boolean;
  description: string;
}

interface FormData extends FollowUpAnswers {
  accidents?: AccidentDetail[];
  features?: string[];
  accidentCount?: number;
}

const FEATURE_GROUPS = {
  comfort: {
    title: 'Comfort Features',
    icon: Star,
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    features: [
      { label: 'Leather Seats', value: 'leather_seats', impact: 500 },
      { label: 'Heated Seats', value: 'heated_seats', impact: 300 },
      { label: 'Cooled/Ventilated Seats', value: 'cooled_seats', impact: 400 },
      { label: 'Memory Seats', value: 'memory_seats', impact: 250 }
    ]
  },
  technology: {
    title: 'Technology Features',
    icon: Zap,
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    features: [
      { label: 'Navigation System', value: 'navigation', impact: 400 },
      { label: 'Premium Audio', value: 'premium_audio', impact: 600 },
      { label: 'Remote Start', value: 'remote_start', impact: 250 },
      { label: 'Wireless Charging', value: 'wireless_charging', impact: 200 }
    ]
  },
  safety: {
    title: 'Safety Features',
    icon: Shield,
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    features: [
      { label: 'Blind Spot Monitor', value: 'blind_spot_monitor', impact: 350 },
      { label: 'Adaptive Cruise Control', value: 'adaptive_cruise', impact: 450 },
      { label: 'Lane Keep Assist', value: 'lane_assist', impact: 300 },
      { label: 'Emergency Braking', value: 'emergency_braking', impact: 400 }
    ]
  },
  exterior: {
    title: 'Exterior Features',
    icon: Sun,
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    features: [
      { label: 'Sunroof/Moonroof', value: 'sunroof', impact: 500 },
      { label: 'Premium Wheels', value: 'premium_wheels', impact: 300 },
      { label: 'All-Wheel Drive', value: 'awd', impact: 800 },
      { label: 'Towing Package', value: 'towing_package', impact: 400 }
    ]
  }
};

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FormData>({
    vin,
    accidents: [],
    features: [],
    accidentCount: 0
  });

  const [openSections, setOpenSections] = useState({
    basics: true,
    condition: false,
    history: false,
    features: false
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress based on completed fields
    let completed = 0;
    let total = 8; // Total required fields

    if (formData.mileage) completed++;
    if (formData.zip_code) completed++;
    if (formData.condition) completed++;
    if (formData.service_history) completed++;
    if (formData.title_status) completed++;
    if (formData.tire_condition) completed++;
    if (formData.accidents !== undefined) completed++;
    if (formData.features && formData.features.length > 0) completed++;

    setProgress((completed / total) * 100);
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addAccident = () => {
    const newAccident: AccidentDetail = {
      date: '',
      location: '',
      severity: 'minor',
      repaired: false,
      description: ''
    };
    updateFormData({
      accidents: [...(formData.accidents || []), newAccident],
      accidentCount: (formData.accidentCount || 0) + 1
    });
  };

  const updateAccident = (index: number, updates: Partial<AccidentDetail>) => {
    const updatedAccidents = [...(formData.accidents || [])];
    updatedAccidents[index] = { ...updatedAccidents[index], ...updates };
    updateFormData({ accidents: updatedAccidents });
  };

  const removeAccident = (index: number) => {
    const updatedAccidents = formData.accidents?.filter((_, i) => i !== index) || [];
    updateFormData({
      accidents: updatedAccidents,
      accidentCount: Math.max(0, (formData.accidentCount || 0) - 1)
    });
  };

  const toggleFeature = (featureValue: string) => {
    const current = formData.features || [];
    const updated = current.includes(featureValue)
      ? current.filter(f => f !== featureValue)
      : [...current, featureValue];
    updateFormData({ features: updated });
  };

  const handleSubmit = () => {
    const submissionData: FollowUpAnswers = {
      ...formData,
      accidents: formData.accidents?.length ? {
        hadAccident: true,
        count: formData.accidents.length,
        description: formData.accidents.map(acc => 
          `${acc.date} - ${acc.location} - ${acc.severity} - ${acc.repaired ? 'Repaired' : 'Not repaired'} - ${acc.description}`
        ).join('; ')
      } : { hadAccident: false }
    };
    onComplete(submissionData);
  };

  const getSectionCompletionIcon = (section: string) => {
    switch (section) {
      case 'basics':
        return formData.mileage && formData.zip_code ? 
          <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      case 'condition':
        return formData.condition ? 
          <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      case 'history':
        return formData.service_history && formData.title_status && formData.tire_condition ? 
          <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      case 'features':
        return formData.features && formData.features.length > 0 ? 
          <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getTotalFeatureValue = () => {
    if (!formData.features) return 0;
    return Object.values(FEATURE_GROUPS).reduce((total, group) => {
      return total + group.features.reduce((groupTotal, feature) => {
        return groupTotal + (formData.features?.includes(feature.value) ? feature.impact : 0);
      }, 0);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-blue-900">Vehicle Valuation Assessment</CardTitle>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mt-3" />
        </CardHeader>
      </Card>

      {/* Vehicle Basics Section */}
      <Card className="border-2 border-green-200 bg-green-50/30">
        <Collapsible open={openSections.basics} onOpenChange={() => toggleSection('basics')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-green-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSectionCompletionIcon('basics')}
                  <Car className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800">Vehicle Basics</CardTitle>
                  <Badge variant="secondary">Step 1 of 4</Badge>
                </div>
                {openSections.basics ? 
                  <ChevronDown className="h-4 w-4 text-green-600" /> : 
                  <ChevronRight className="h-4 w-4 text-green-600" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage" className="text-green-800 font-medium">Current Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="e.g., 45000"
                    value={formData.mileage || ''}
                    onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
                    className="border-green-200 focus:ring-green-200"
                  />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-green-800 font-medium">ZIP Code *</Label>
                  <Input
                    id="zip"
                    placeholder="e.g., 90210"
                    value={formData.zip_code || ''}
                    onChange={(e) => updateFormData({ zip_code: e.target.value })}
                    className="border-green-200 focus:ring-green-200"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Vehicle Condition Section */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <Collapsible open={openSections.condition} onOpenChange={() => toggleSection('condition')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSectionCompletionIcon('condition')}
                  <Star className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-800">Vehicle Condition</CardTitle>
                  <Badge variant="secondary">Step 2 of 4</Badge>
                </div>
                {openSections.condition ? 
                  <ChevronDown className="h-4 w-4 text-blue-600" /> : 
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-blue-800 font-medium mb-3 block">Overall Condition *</Label>
                <RadioGroup
                  value={formData.condition}
                  onValueChange={(value) => updateFormData({ condition: value as any })}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {[
                    { value: 'excellent', label: 'Excellent', description: 'Like new', impact: '+15-20%' },
                    { value: 'good', label: 'Good', description: 'Minor wear', impact: 'Baseline' },
                    { value: 'fair', label: 'Fair', description: 'Visible issues', impact: '-10-20%' },
                    { value: 'poor', label: 'Poor', description: 'Needs repair', impact: '-25-40%' }
                  ].map((option) => (
                    <div key={option.value} className="relative">
                      <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      <Label
                        htmlFor={option.value}
                        className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          formData.condition === option.value
                            ? 'border-blue-500 bg-blue-100 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <span className="font-semibold text-gray-900">{option.label}</span>
                        <span className="text-xs text-gray-600">{option.description}</span>
                        <span className="text-xs font-medium text-blue-600 mt-1">{option.impact}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Accident History */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <Label className="text-blue-800 font-medium">Accident History</Label>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-700">Number of accidents</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.accidentCount || 0}
                        onChange={(e) => {
                          const count = parseInt(e.target.value) || 0;
                          updateFormData({ accidentCount: count });
                          // Adjust accidents array to match count
                          const current = formData.accidents || [];
                          if (count > current.length) {
                            for (let i = current.length; i < count; i++) {
                              addAccident();
                            }
                          } else if (count < current.length) {
                            updateFormData({ accidents: current.slice(0, count) });
                          }
                        }}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">accidents</span>
                    </div>
                  </div>

                  {formData.accidents && formData.accidents.map((accident, index) => (
                    <Card key={index} className="border border-orange-200 bg-orange-50/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-orange-800">
                            Accident {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAccident(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium">Approximate Date</Label>
                            <Input
                              placeholder="e.g., 2022 or Jan 2022"
                              value={accident.date}
                              onChange={(e) => updateAccident(index, { date: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Damage Location</Label>
                            <Select
                              value={accident.location}
                              onValueChange={(value) => updateAccident(index, { location: value })}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="front">Front</SelectItem>
                                <SelectItem value="rear">Rear</SelectItem>
                                <SelectItem value="driver-side">Driver Side</SelectItem>
                                <SelectItem value="passenger-side">Passenger Side</SelectItem>
                                <SelectItem value="roof">Roof</SelectItem>
                                <SelectItem value="multiple">Multiple Areas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium">Severity</Label>
                            <RadioGroup
                              value={accident.severity}
                              onValueChange={(value) => updateAccident(index, { severity: value as any })}
                              className="flex gap-2 mt-1"
                            >
                              {['minor', 'moderate', 'major'].map((severity) => (
                                <div key={severity} className="flex items-center space-x-1">
                                  <RadioGroupItem value={severity} id={`${index}-${severity}`} />
                                  <Label htmlFor={`${index}-${severity}`} className="text-xs capitalize">
                                    {severity}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                              id={`repaired-${index}`}
                              checked={accident.repaired}
                              onCheckedChange={(checked) => updateAccident(index, { repaired: !!checked })}
                            />
                            <Label htmlFor={`repaired-${index}`} className="text-xs">
                              Professionally repaired
                            </Label>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium">Description</Label>
                          <Textarea
                            placeholder="Brief description of the accident and repairs..."
                            value={accident.description}
                            onChange={(e) => updateAccident(index, { description: e.target.value })}
                            className="text-sm mt-1"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Service & History Section */}
      <Card className="border-2 border-purple-200 bg-purple-50/30">
        <Collapsible open={openSections.history} onOpenChange={() => toggleSection('history')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSectionCompletionIcon('history')}
                  <Wrench className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-purple-800">Service & History</CardTitle>
                  <Badge variant="secondary">Step 3 of 4</Badge>
                </div>
                {openSections.history ? 
                  <ChevronDown className="h-4 w-4 text-purple-600" /> : 
                  <ChevronRight className="h-4 w-4 text-purple-600" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-purple-800 font-medium mb-3 block">Service History *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'dealer', label: 'Dealer Maintained', impact: '+5-10%' },
                    { value: 'independent', label: 'Independent Shop', impact: '+2-5%' },
                    { value: 'owner', label: 'Owner Maintained', impact: 'Neutral' },
                    { value: 'unknown', label: 'Unknown History', impact: '-5-10%' }
                  ].map((option) => (
                    <div key={option.value} className="relative">
                      <Label
                        className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          formData.service_history === option.value
                            ? 'border-purple-500 bg-purple-100 shadow-md'
                            : 'border-gray-200 bg-white hover:border-purple-300'
                        }`}
                        onClick={() => updateFormData({ service_history: option.value })}
                      >
                        <span className="font-medium text-sm text-gray-900">{option.label}</span>
                        <span className="text-xs font-medium text-purple-600 mt-1">{option.impact}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-purple-800 font-medium mb-3 block">Title Status *</Label>
                  <Select
                    value={formData.title_status}
                    onValueChange={(value) => updateFormData({ title_status: value })}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Select title status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean">Clean Title</SelectItem>
                      <SelectItem value="salvage">Salvage Title</SelectItem>
                      <SelectItem value="rebuilt">Rebuilt Title</SelectItem>
                      <SelectItem value="branded">Branded Title</SelectItem>
                      <SelectItem value="lemon">Lemon Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-purple-800 font-medium mb-3 block">Tire Condition *</Label>
                  <Select
                    value={formData.tire_condition}
                    onValueChange={(value) => updateFormData({ tire_condition: value })}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Select tire condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (8/32"+ tread)</SelectItem>
                      <SelectItem value="good">Good (6-7/32")</SelectItem>
                      <SelectItem value="worn">Worn (3-5/32")</SelectItem>
                      <SelectItem value="replacement">Needs Replacement (&lt;3/32")</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="maintenance-notes" className="text-purple-800 font-medium">Additional Maintenance Notes</Label>
                <Textarea
                  id="maintenance-notes"
                  placeholder="Recent services, repairs, or maintenance records..."
                  value={formData.maintenance_status || ''}
                  onChange={(e) => updateFormData({ maintenance_status: e.target.value })}
                  className="border-purple-200 focus:ring-purple-200 mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* High-Impact Features Section */}
      <Card className="border-2 border-orange-200 bg-orange-50/30">
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-orange-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSectionCompletionIcon('features')}
                  <Settings className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-orange-800">High-Impact Features</CardTitle>
                  <Badge variant="secondary">Step 4 of 4</Badge>
                  {formData.features && formData.features.length > 0 && (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      +${getTotalFeatureValue().toLocaleString()}
                    </Badge>
                  )}
                </div>
                {openSections.features ? 
                  <ChevronDown className="h-4 w-4 text-orange-600" /> : 
                  <ChevronRight className="h-4 w-4 text-orange-600" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <p className="text-sm text-orange-700">
                Select features that your vehicle has. Each feature adds to your vehicle's estimated value.
              </p>
              
              {Object.entries(FEATURE_GROUPS).map(([key, group]) => {
                const IconComponent = group.icon;
                return (
                  <Card key={key} className={`${group.color} border-2`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-white rounded-lg`}>
                          <IconComponent className={`h-5 w-5 ${group.iconColor}`} />
                        </div>
                        <CardTitle className="text-lg">{group.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.features.map((feature) => (
                          <div key={feature.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`feature-${feature.value}`}
                              checked={formData.features?.includes(feature.value) || false}
                              onCheckedChange={() => toggleFeature(feature.value)}
                            />
                            <Label 
                              htmlFor={`feature-${feature.value}`}
                              className="flex-1 text-sm font-medium cursor-pointer"
                            >
                              {feature.label}
                              <span className="text-xs text-green-600 ml-2 font-semibold">
                                +${feature.impact}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {formData.features && formData.features.length > 0 && (
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-800">Total Feature Value:</span>
                      <span className="text-2xl font-bold text-green-700">
                        +${getTotalFeatureValue().toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Submit Button */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900">Ready to Get Your Valuation?</h3>
              <p className="text-sm text-blue-700">
                Complete form • {Math.round(progress)}% done
                {formData.features && formData.features.length > 0 && (
                  <span className="ml-2 text-green-600 font-semibold">
                    • ${getTotalFeatureValue().toLocaleString()} in features
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              disabled={progress < 60} // Require at least basic info
            >
              Get My Vehicle Valuation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UnifiedFollowUpForm;
