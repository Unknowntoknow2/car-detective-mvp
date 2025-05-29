
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Car, 
  MapPin, 
  Gauge, 
  AlertCircle, 
  Wrench, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';
import { toast } from 'sonner';

interface FormData extends Omit<FollowUpAnswers, 'accidents'> {
  accidents?: AccidentDetails;
  features?: string[];
}

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

const FEATURE_OPTIONS = [
  { category: 'Comfort', items: [
    { label: 'Leather Seats', value: 'leather_seats', impact: 500 },
    { label: 'Heated Seats', value: 'heated_seats', impact: 300 },
    { label: 'Cooled Seats', value: 'cooled_seats', impact: 400 },
  ]},
  { category: 'Technology', items: [
    { label: 'Navigation System', value: 'navigation', impact: 400 },
    { label: 'Premium Audio', value: 'premium_audio', impact: 350 },
    { label: 'Remote Start', value: 'remote_start', impact: 200 },
    { label: 'Wireless Charging', value: 'wireless_charging', impact: 150 },
  ]},
  { category: 'Safety', items: [
    { label: 'Blind Spot Monitor', value: 'blind_spot_monitor', impact: 350 },
    { label: 'Adaptive Cruise Control', value: 'adaptive_cruise', impact: 450 },
    { label: 'Lane Assist', value: 'lane_assist', impact: 300 },
    { label: 'Emergency Braking', value: 'emergency_braking', impact: 400 },
  ]},
  { category: 'Exterior', items: [
    { label: 'Sunroof/Moonroof', value: 'sunroof', impact: 250 },
    { label: 'Premium Wheels', value: 'premium_wheels', impact: 300 },
    { label: 'All-Wheel Drive', value: 'awd', impact: 500 },
  ]},
];

export const UnifiedFollowUpForm: React.FC<UnifiedFollowUpFormProps> = ({
  vin,
  onComplete
}) => {
  const [formData, setFormData] = useState<FormData>({
    vin,
    accidents: {
      hadAccident: false,
      count: 0,
      severity: undefined,
      repaired: undefined,
      frameDamage: false,
      description: ''
    },
    features: []
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basics: true,
    condition: false,
    service: false,
    details: false
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateProgress = () => {
    let completed = 0;
    let total = 6; // Total required fields

    if (formData.mileage) completed++;
    if (formData.zip_code) completed++;
    if (formData.condition) completed++;
    if (formData.service_history) completed++;
    if (formData.title_status) completed++;
    if (formData.tire_condition) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleAccidentChange = (field: keyof AccidentDetails, value: any) => {
    const currentAccidents = formData.accidents || {
      hadAccident: false,
      count: 0,
      severity: undefined,
      repaired: undefined,
      frameDamage: false,
      description: ''
    };

    updateFormData({
      accidents: {
        ...currentAccidents,
        [field]: value
      }
    });
  };

  const handleFeatureToggle = (featureValue: string) => {
    const currentFeatures = formData.features || [];
    const updated = currentFeatures.includes(featureValue)
      ? currentFeatures.filter(f => f !== featureValue)
      : [...currentFeatures, featureValue];
    
    updateFormData({ features: updated });
  };

  const handleSubmit = () => {
    const requiredFields = ['mileage', 'zip_code', 'condition'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);

    if (missingFields.length > 0) {
      toast.error(`Please fill out: ${missingFields.join(', ')}`);
      return;
    }

    // Convert to FollowUpAnswers format
    const submissionData: FollowUpAnswers = {
      ...formData,
      features: undefined // Remove features as it's not in FollowUpAnswers
    };

    onComplete(submissionData);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Assessment</h2>
              <p className="text-gray-600">Complete your vehicle details for accurate valuation</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {progress}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Vehicle Basics Section */}
      <Card className="border-green-200 bg-green-50/30">
        <Collapsible 
          open={openSections.basics} 
          onOpenChange={() => toggleSection('basics')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-green-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Car className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Vehicle Basics</CardTitle>
                </div>
                {openSections.basics ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="e.g., 50,000"
                    value={formData.mileage || ''}
                    onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="e.g., 90210"
                    value={formData.zip_code || ''}
                    onChange={(e) => updateFormData({ zip_code: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Overall Condition *</Label>
                  <RadioGroup
                    value={formData.condition || ''}
                    onValueChange={(value) => updateFormData({ condition: value as any })}
                    className="mt-2"
                  >
                    {['excellent', 'good', 'fair', 'poor'].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <RadioGroupItem value={condition} id={condition} />
                        <Label htmlFor={condition} className="capitalize">{condition}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Accident & Condition Section */}
      <Card className="border-red-200 bg-red-50/30">
        <Collapsible 
          open={openSections.condition} 
          onOpenChange={() => toggleSection('condition')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-red-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="text-red-900">Accident & Condition History</CardTitle>
                </div>
                {openSections.condition ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <Label>Has this vehicle been in any accidents?</Label>
                <RadioGroup
                  value={formData.accidents?.hadAccident ? 'yes' : 'no'}
                  onValueChange={(value) => handleAccidentChange('hadAccident', value === 'yes')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-accident" />
                    <Label htmlFor="no-accident">No accidents</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-accident" />
                    <Label htmlFor="yes-accident">Yes, there have been accidents</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.accidents?.hadAccident && (
                <div className="space-y-4 p-4 bg-white rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accident-count">Number of accidents</Label>
                      <Input
                        id="accident-count"
                        type="number"
                        min="1"
                        value={formData.accidents?.count || ''}
                        onChange={(e) => handleAccidentChange('count', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Severity of most serious accident</Label>
                      <RadioGroup
                        value={formData.accidents?.severity || ''}
                        onValueChange={(value) => handleAccidentChange('severity', value as any)}
                        className="mt-2"
                      >
                        {['minor', 'moderate', 'major'].map((severity) => (
                          <div key={severity} className="flex items-center space-x-2">
                            <RadioGroupItem value={severity} id={`severity-${severity}`} />
                            <Label htmlFor={`severity-${severity}`} className="capitalize">{severity}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label>Were all accidents professionally repaired?</Label>
                    <RadioGroup
                      value={formData.accidents?.repaired ? 'yes' : 'no'}
                      onValueChange={(value) => handleAccidentChange('repaired', value === 'yes')}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="repaired-yes" />
                        <Label htmlFor="repaired-yes">Yes, professionally repaired</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="repaired-no" />
                        <Label htmlFor="repaired-no">No or DIY repairs</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="frame-damage"
                      checked={formData.accidents?.frameDamage || false}
                      onCheckedChange={(checked) => handleAccidentChange('frameDamage', checked)}
                    />
                    <Label htmlFor="frame-damage">Frame damage reported</Label>
                  </div>

                  <div>
                    <Label htmlFor="accident-description">Additional accident details</Label>
                    <Textarea
                      id="accident-description"
                      placeholder="Describe the accidents, repairs, or any related issues..."
                      value={formData.accidents?.description || ''}
                      onChange={(e) => handleAccidentChange('description', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Service & History Section */}
      <Card className="border-purple-200 bg-purple-50/30">
        <Collapsible 
          open={openSections.service} 
          onOpenChange={() => toggleSection('service')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Wrench className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-900">Service & Maintenance History</CardTitle>
                </div>
                {openSections.service ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <Label>Service History</Label>
                <RadioGroup
                  value={formData.service_history || ''}
                  onValueChange={(value) => updateFormData({ service_history: value })}
                  className="mt-2"
                >
                  {[
                    { value: 'dealer', label: 'Dealer-maintained' },
                    { value: 'independent', label: 'Independent mechanic' },
                    { value: 'owner', label: 'Owner-maintained' },
                    { value: 'unknown', label: 'No known history' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`service-${option.value}`} />
                      <Label htmlFor={`service-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Title Status</Label>
                <RadioGroup
                  value={formData.title_status || ''}
                  onValueChange={(value) => updateFormData({ title_status: value })}
                  className="mt-2"
                >
                  {[
                    { value: 'clean', label: 'Clean Title' },
                    { value: 'salvage', label: 'Salvage Title' },
                    { value: 'rebuilt', label: 'Rebuilt Title' },
                    { value: 'branded', label: 'Branded Title' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`title-${option.value}`} />
                      <Label htmlFor={`title-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Tire Condition</Label>
                <RadioGroup
                  value={formData.tire_condition || ''}
                  onValueChange={(value) => updateFormData({ tire_condition: value })}
                  className="mt-2"
                >
                  {[
                    { value: 'excellent', label: 'Excellent (8/32"+ tread)' },
                    { value: 'good', label: 'Good (6–7/32")' },
                    { value: 'worn', label: 'Worn (3–5/32")' },
                    { value: 'replacement', label: 'Needs Replacement (<3/32")' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`tire-${option.value}`} />
                      <Label htmlFor={`tire-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* High-Impact Features Section */}
      <Card className="border-blue-200 bg-blue-50/30">
        <Collapsible 
          open={openSections.details} 
          onOpenChange={() => toggleSection('details')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-900">High-Impact Features</CardTitle>
                </div>
                {openSections.details ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {FEATURE_OPTIONS.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">{category.category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((feature) => (
                      <div 
                        key={feature.value} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          formData.features?.includes(feature.value) 
                            ? 'bg-blue-100 border-blue-300' 
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`feature-${feature.value}`}
                            checked={formData.features?.includes(feature.value) || false}
                            onCheckedChange={() => handleFeatureToggle(feature.value)}
                          />
                          <Label htmlFor={`feature-${feature.value}`} className="font-medium">
                            {feature.label}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          +${feature.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Progress: {progress}% complete
              </p>
              <p className="text-xs text-gray-500">
                {formData.features?.length || 0} features selected
              </p>
            </div>
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="bg-primary hover:bg-primary/90"
              disabled={progress < 50}
            >
              Complete Valuation Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedFollowUpForm;
