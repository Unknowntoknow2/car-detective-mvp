
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Car, 
  Shield, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Sparkles,
  Palette,
  Home,
  DollarSign
} from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { FeaturesSelector } from '@/components/valuation/FeaturesSelector';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedFollowUpFormProps {
  vin: string;
  vehicle?: DecodedVehicleInfo;
  onComplete: (formData: FollowUpAnswers) => void;
}

const CONDITION_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'Like new condition with minimal wear and tear',
    impact: '+15% to +20% value',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Normal wear and tear for age, well maintained',
    impact: 'Market value baseline',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Visible damage or mechanical issues requiring attention',
    impact: '-10% to -20% value',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Significant mechanical/cosmetic issues, needs major repairs',
    impact: '-25% to -40% value',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  }
];

const FEATURE_CATEGORIES = {
  Safety: [
    { name: 'ABS', value: 200 },
    { name: 'Airbags (Front)', value: 300 },
    { name: 'Airbags (Side)', value: 250 },
    { name: 'Backup Camera', value: 400 },
    { name: 'Blind Spot Monitor', value: 600 },
    { name: 'Lane Departure Warning', value: 500 },
    { name: 'Automatic Emergency Braking', value: 800 }
  ],
  Technology: [
    { name: 'Bluetooth', value: 200 },
    { name: 'Navigation System', value: 800 },
    { name: 'Premium Sound System', value: 600 },
    { name: 'Remote Start', value: 400 },
    { name: 'Wireless Charging', value: 300 },
    { name: 'Apple CarPlay/Android Auto', value: 400 }
  ],
  Comfort: [
    { name: 'Leather Seats', value: 1200 },
    { name: 'Heated Seats', value: 500 },
    { name: 'Cooled Seats', value: 700 },
    { name: 'Sunroof', value: 800 },
    { name: 'Keyless Entry', value: 200 },
    { name: 'Power Seats', value: 400 },
    { name: 'Dual Zone Climate', value: 300 }
  ],
  Other: [
    { name: 'Alloy Wheels', value: 400 },
    { name: 'Third-Row Seating', value: 1000 },
    { name: 'Four-Wheel Drive', value: 1500 },
    { name: 'Tow Package', value: 600 },
    { name: 'Roof Rack', value: 200 },
    { name: 'Running Boards', value: 300 }
  ]
};

export const UnifiedFollowUpForm: React.FC<UnifiedFollowUpFormProps> = ({
  vin,
  vehicle,
  onComplete
}) => {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: 0,
    zip_code: '',
    condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    accidents: { hadAccident: false },
    service_history: 'unknown',
    features: [],
    completion_percentage: 0
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featureValueTotal, setFeatureValueTotal] = useState(0);

  useEffect(() => {
    const total = selectedFeatures.reduce((sum, featureName) => {
      const feature = Object.values(FEATURE_CATEGORIES)
        .flat()
        .find(f => f.name === featureName);
      return sum + (feature?.value || 0);
    }, 0);
    setFeatureValueTotal(total);
  }, [selectedFeatures]);

  const handleFeatureToggle = (featureName: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName];
      
      setFormData(prevData => ({
        ...prevData,
        features: newFeatures
      }));
      
      return newFeatures;
    });
  };

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      formData.mileage,
      formData.zip_code,
      formData.exterior_condition,
      formData.interior_condition
    ];
    const filledFields = requiredFields.filter(field => field && field !== 0).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      features: selectedFeatures,
      completion_percentage: 100,
      is_complete: true
    };
    onComplete(finalData);
  };

  const ConditionSelector = ({ 
    value, 
    onChange, 
    title, 
    description 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    title: string; 
    description: string; 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {CONDITION_OPTIONS.map((option) => (
          <div key={option.value} className={`border rounded-lg p-4 ${option.bgColor} hover:shadow-sm transition-all`}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value={option.value} id={`${title}-${option.value}`} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={`${title}-${option.value}`} className="cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${option.color}`}>{option.label}</span>
                    <Badge variant="outline" className={`text-xs ${option.color}`}>
                      {option.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </Label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Details & Features
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Help us provide the most accurate valuation for your {vehicle?.year} {vehicle?.make} {vehicle?.model}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={calculateProgress()} className="w-20" />
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Form Accordion */}
      <Accordion type="multiple" defaultValue={["basic", "condition", "features"]} className="space-y-4">
        
        {/* Basic Information */}
        <AccordionItem value="basic">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Basic Vehicle Information</h3>
                  <p className="text-sm text-gray-600">Mileage and location details</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g. 45,000"
                      value={formData.mileage || ''}
                      onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipcode">ZIP Code</Label>
                    <Input
                      id="zipcode"
                      placeholder="e.g. 90210"
                      value={formData.zip_code || ''}
                      onChange={(e) => updateFormData({ zip_code: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Vehicle Condition */}
        <AccordionItem value="condition">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Vehicle Condition Assessment</h3>
                  <p className="text-sm text-gray-600">Exterior and interior condition evaluation</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-8">
                {/* Exterior Condition */}
                <ConditionSelector
                  value={formData.exterior_condition || 'good'}
                  onChange={(value) => updateFormData({ exterior_condition: value as any })}
                  title="Exterior Condition"
                  description="Evaluate the paint, body panels, glass, wheels, and overall exterior appearance"
                />

                {/* Interior Condition */}
                <ConditionSelector
                  value={formData.interior_condition || 'good'}
                  onChange={(value) => updateFormData({ interior_condition: value as any })}
                  title="Interior Condition"
                  description="Assess seats, dashboard, electronics, cleanliness, and overall interior wear"
                />
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Vehicle Features */}
        <AccordionItem value="features">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Vehicle Features & Options</h3>
                    <p className="text-sm text-gray-600">Select features that add value to your vehicle</p>
                  </div>
                </div>
                <AnimatePresence>
                  {featureValueTotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">+${featureValueTotal.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                {/* Feature Value Breakdown */}
                {selectedFeatures.length > 0 && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Feature Adjustments
                    </h4>
                    <div className="space-y-1 text-sm">
                      {selectedFeatures.map(featureName => {
                        const feature = Object.values(FEATURE_CATEGORIES)
                          .flat()
                          .find(f => f.name === featureName);
                        return feature ? (
                          <div key={featureName} className="flex justify-between text-green-700">
                            <span>+ ${feature.value.toLocaleString()}</span>
                            <span>{feature.name}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-semibold text-green-800">
                        <span>= ${featureValueTotal.toLocaleString()}</span>
                        <span>Total Added Value</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature Categories */}
                <div className="space-y-6">
                  {Object.entries(FEATURE_CATEGORIES).map(([category, features]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((feature) => (
                          <div
                            key={feature.name}
                            className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                              selectedFeatures.includes(feature.name)
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleFeatureToggle(feature.name)}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={selectedFeatures.includes(feature.name)}
                                onChange={() => handleFeatureToggle(feature.name)}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm">{feature.name}</span>
                                  <span className="text-green-600 font-medium text-sm">
                                    +${feature.value.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Accident History */}
        <AccordionItem value="accidents">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Accident History</h3>
                  <p className="text-sm text-gray-600">Any damage or accident history</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div>
                  <Label>Has this vehicle been in any accidents?</Label>
                  <RadioGroup
                    value={formData.accidents?.hadAccident ? 'yes' : 'no'}
                    onValueChange={(value) => updateFormData({
                      accidents: { hadAccident: value === 'yes' }
                    })}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-accident" />
                      <Label htmlFor="no-accident">No accidents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-accident" />
                      <Label htmlFor="yes-accident">Yes, has accident history</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.accidents?.hadAccident && (
                  <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <Label htmlFor="accident-severity">Severity</Label>
                      <Select
                        value={formData.accidents?.severity || 'minor'}
                        onValueChange={(value) => updateFormData({
                          accidents: { ...formData.accidents!, severity: value as any }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="accident-description">Description (Optional)</Label>
                      <Textarea
                        id="accident-description"
                        placeholder="Brief description of the accident and repairs..."
                        value={formData.accidents?.description || ''}
                        onChange={(e) => updateFormData({
                          accidents: { ...formData.accidents!, description: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Service & Maintenance */}
        <AccordionItem value="service">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Service & Maintenance</h3>
                  <p className="text-sm text-gray-600">Maintenance history and records</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="service-history">Service History</Label>
                  <Select
                    value={formData.service_history || 'unknown'}
                    onValueChange={(value) => updateFormData({ service_history: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dealer">Dealer-maintained</SelectItem>
                      <SelectItem value="independent">Independent mechanic</SelectItem>
                      <SelectItem value="owner">Owner-maintained</SelectItem>
                      <SelectItem value="unknown">No known history</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maintenance-notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="maintenance-notes"
                    placeholder="Any additional maintenance details..."
                    value={formData.maintenance_status || ''}
                    onChange={(e) => updateFormData({ maintenance_status: e.target.value })}
                  />
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      {/* Submit Button */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to get your valuation?</p>
              <p className="text-sm text-gray-600">
                All information provided will be used to calculate the most accurate value.
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={calculateProgress() < 50}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Get My Valuation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedFollowUpForm;
