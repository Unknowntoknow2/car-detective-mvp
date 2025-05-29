import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FollowUpAnswers, AccidentDetails, ModificationDetails } from '@/types/follow-up-answers';
import { 
  Car, 
  MapPin, 
  Wrench, 
  FileText, 
  AlertTriangle, 
  Settings, 
  Star,
  Shield,
  Smartphone,
  Volume2,
  Sun,
  Thermometer,
  Eye,
  Zap,
  Crown,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedFollowUpFormProps {
  vin: string;
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
    standard_features?: string[];
  };
  onComplete: (data: FollowUpAnswers) => void;
}

// Enhanced feature database with enterprise-grade categorization and pricing
const PREMIUM_FEATURES = {
  // Interior Comfort & Luxury
  'leather_seats': { 
    name: 'Leather Seats', 
    value: 800, 
    icon: '🪑', 
    category: 'Interior',
    description: 'Premium leather upholstery'
  },
  'heated_seats': { 
    name: 'Heated Seats', 
    value: 500, 
    icon: '🔥', 
    category: 'Interior',
    description: 'Front seat heating'
  },
  'ventilated_seats': { 
    name: 'Ventilated/Cooled Seats', 
    value: 600, 
    icon: '❄️', 
    category: 'Interior',
    description: 'Climate controlled seats'
  },
  'memory_seats': { 
    name: 'Memory Seats', 
    value: 400, 
    icon: '💾', 
    category: 'Interior',
    description: 'Programmable seat positions'
  },
  'heated_steering_wheel': { 
    name: 'Heated Steering Wheel', 
    value: 200, 
    icon: '🔥', 
    category: 'Interior',
    description: 'Heated steering wheel'
  },

  // Roof & Glass
  'sunroof': { 
    name: 'Sunroof/Moonroof', 
    value: 800, 
    icon: '☀️', 
    category: 'Roof',
    description: 'Power sunroof or moonroof'
  },
  'panoramic_roof': { 
    name: 'Panoramic Roof', 
    value: 1200, 
    icon: '🌅', 
    category: 'Roof',
    description: 'Full panoramic glass roof'
  },

  // Technology & Infotainment
  'navigation_system': { 
    name: 'Navigation System', 
    value: 600, 
    icon: '🗺️', 
    category: 'Technology',
    description: 'Built-in GPS navigation'
  },
  'premium_audio': { 
    name: 'Premium Audio System', 
    value: 800, 
    icon: '🔊', 
    category: 'Technology',
    description: 'Brand-name premium sound system'
  },
  'wireless_charging': { 
    name: 'Wireless Phone Charging', 
    value: 300, 
    icon: '📱', 
    category: 'Technology',
    description: 'Wireless charging pad'
  },
  'heads_up_display': { 
    name: 'Heads-Up Display', 
    value: 700, 
    icon: '📊', 
    category: 'Technology',
    description: 'Windshield HUD'
  },

  // Safety & Driver Assistance
  'adaptive_cruise': { 
    name: 'Adaptive Cruise Control', 
    value: 900, 
    icon: '🚗', 
    category: 'Safety',
    description: 'Intelligent cruise control'
  },
  'lane_keep_assist': { 
    name: 'Lane Keep Assist', 
    value: 600, 
    icon: '🛣️', 
    category: 'Safety',
    description: 'Active lane keeping'
  },
  'blind_spot_monitoring': { 
    name: 'Blind Spot Monitoring', 
    value: 500, 
    icon: '👁️', 
    category: 'Safety',
    description: 'Blind spot detection'
  },
  'backup_camera': { 
    name: 'Backup Camera', 
    value: 400, 
    icon: '📹', 
    category: 'Safety',
    description: 'Rear view camera'
  },
  '360_camera': { 
    name: '360-Degree Camera', 
    value: 1000, 
    icon: '📷', 
    category: 'Safety',
    description: 'Surround view cameras'
  },
  'parking_sensors': { 
    name: 'Parking Sensors', 
    value: 300, 
    icon: '📡', 
    category: 'Safety',
    description: 'Front/rear parking sensors'
  },

  // Performance & Drivetrain
  'all_wheel_drive': { 
    name: 'All-Wheel Drive', 
    value: 1500, 
    icon: '⚙️', 
    category: 'Performance',
    description: 'AWD system'
  },
  'sport_package': { 
    name: 'Sport Package', 
    value: 1200, 
    icon: '🏁', 
    category: 'Performance',
    description: 'Sport suspension and styling'
  },

  // Convenience
  'remote_start': { 
    name: 'Remote Start', 
    value: 400, 
    icon: '🔑', 
    category: 'Convenience',
    description: 'Remote engine start'
  },
  'power_liftgate': { 
    name: 'Power Liftgate', 
    value: 600, 
    icon: '🚪', 
    category: 'Convenience',
    description: 'Automatic rear liftgate'
  },
  'keyless_entry': { 
    name: 'Keyless Entry/Start', 
    value: 300, 
    icon: '🗝️', 
    category: 'Convenience',
    description: 'Push-button start'
  }
};

const FEATURE_CATEGORIES = {
  'Interior': { color: 'bg-amber-50 border-amber-200', icon: Crown },
  'Roof': { color: 'bg-blue-50 border-blue-200', icon: Sun },
  'Technology': { color: 'bg-purple-50 border-purple-200', icon: Smartphone },
  'Safety': { color: 'bg-green-50 border-green-200', icon: Shield },
  'Performance': { color: 'bg-red-50 border-red-200', icon: Zap },
  'Convenience': { color: 'bg-gray-50 border-gray-200', icon: Settings }
};

export function UnifiedFollowUpForm({ vin, vehicleInfo, onComplete }: UnifiedFollowUpFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: 0,
    zip_code: '',
    condition: 'good',
    accidents: { hadAccident: false },
    modifications: { modified: false },
    features: [],
    completion_percentage: 0,
    is_complete: false
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [standardFeatures, setStandardFeatures] = useState<string[]>([]);

  // Auto-detect standard features from vehicle info
  useEffect(() => {
    if (vehicleInfo?.standard_features) {
      const mappedStandard = vehicleInfo.standard_features
        .map(feature => {
          const featureKey = Object.keys(PREMIUM_FEATURES).find(key => 
            PREMIUM_FEATURES[key].name.toLowerCase().includes(feature.toLowerCase()) ||
            feature.toLowerCase().includes(PREMIUM_FEATURES[key].name.toLowerCase())
          );
          return featureKey;
        })
        .filter(Boolean) as string[];
      
      setStandardFeatures(mappedStandard);
    }
  }, [vehicleInfo]);

  // Calculate total feature value
  const calculateFeatureValue = () => {
    return selectedFeatures.reduce((total, featureKey) => {
      return total + (PREMIUM_FEATURES[featureKey]?.value || 0);
    }, 0);
  };

  const totalFeatureValue = calculateFeatureValue();

  // Group features by category
  const featuresByCategory = Object.entries(PREMIUM_FEATURES).reduce((acc, [key, feature]) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push({ key, ...feature });
    return acc;
  }, {} as Record<string, Array<{ key: string } & typeof PREMIUM_FEATURES[string]>>);

  const handleFeatureToggle = (featureKey: string) => {
    if (standardFeatures.includes(featureKey)) return; // Prevent toggling standard features
    
    setSelectedFeatures(prev => {
      const newSelection = prev.includes(featureKey)
        ? prev.filter(f => f !== featureKey)
        : [...prev, featureKey];
      
      setFormData(current => ({
        ...current,
        features: newSelection
      }));
      
      return newSelection;
    });
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: Car, description: 'Mileage, ZIP, Condition' },
    { id: 2, title: 'Accident History', icon: AlertTriangle, description: 'Damage & Repairs' },
    { id: 3, title: 'Service History', icon: Wrench, description: 'Maintenance Records' },
    { id: 4, title: 'Vehicle Features', icon: Star, description: 'Premium Equipment' },
    { id: 5, title: 'Title & Ownership', icon: FileText, description: 'Legal Status' },
    { id: 6, title: 'Review & Complete', icon: CheckCircle2, description: 'Final Verification' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Complete Your Valuation</h2>
        <Badge variant="outline" className="text-sm">
          Step {currentStep} of {steps.length}
        </Badge>
      </div>
      <Progress value={progress} className="mb-6" />
      <div className="grid grid-cols-6 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="text-center">
              <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white ring-4 ring-blue-200' 
                  : isCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-gray-700">{step.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Features & Equipment</h3>
        <p className="text-gray-600">
          Select premium features that add value to your {vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}
        </p>
      </div>

      {/* Real-time Feature Value Tracker */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 z-10 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Feature Adjustments</h4>
              <p className="text-sm text-gray-600">{selectedFeatures.length} features selected</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              +${totalFeatureValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Added Value</div>
          </div>
        </div>
        
        {/* Feature Breakdown */}
        <AnimatePresence>
          {selectedFeatures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-green-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {selectedFeatures.map(featureKey => {
                  const feature = PREMIUM_FEATURES[featureKey];
                  return (
                    <div key={featureKey} className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {feature.icon} {feature.name}
                      </span>
                      <span className="font-medium text-green-600">
                        +${feature.value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {Object.entries(featuresByCategory).map(([categoryName, features]) => {
          const categoryConfig = FEATURE_CATEGORIES[categoryName];
          const CategoryIcon = categoryConfig.icon;
          
          return (
            <Card key={categoryName} className={`${categoryConfig.color} border-2 shadow-sm`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CategoryIcon className="h-5 w-5 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">{categoryName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => {
                    const isStandard = standardFeatures.includes(feature.key);
                    const isSelected = selectedFeatures.includes(feature.key);
                    
                    return (
                      <motion.div
                        key={feature.key}
                        whileHover={{ scale: isStandard ? 1 : 1.02 }}
                        whileTap={{ scale: isStandard ? 1 : 0.98 }}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isStandard 
                            ? 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
                            : isSelected
                              ? 'bg-white border-blue-500 shadow-lg ring-2 ring-blue-200'
                              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                        onClick={() => !isStandard && handleFeatureToggle(feature.key)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{feature.icon}</span>
                              <div>
                                <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-green-600">
                                {isStandard ? 'Included' : `+$${feature.value.toLocaleString()}`}
                              </div>
                              
                              {isStandard ? (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Standard
                                </Badge>
                              ) : (
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleFeatureToggle(feature.key)}
                                  className="w-5 h-5"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Selection Indicator */}
                        {isSelected && !isStandard && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setFormData(prev => ({
        ...prev,
        completion_percentage: ((currentStep + 1) / steps.length) * 100
      }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const finalData: FollowUpAnswers = {
      ...formData,
      features: selectedFeatures,
      completion_percentage: 100,
      is_complete: true,
      updated_at: new Date().toISOString()
    };
    
    onComplete(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepIndicator()}
      
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Vehicle Information</h3>
                <p className="text-gray-600">Help us understand your vehicle's current condition</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-sm font-medium">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="e.g., 45,000"
                    value={formData.mileage || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      mileage: parseInt(e.target.value) || 0
                    }))}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-sm font-medium">ZIP Code</Label>
                  <Input
                    id="zip"
                    placeholder="e.g., 90210"
                    value={formData.zip_code || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      zip_code: e.target.value
                    }))}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Overall Vehicle Condition</Label>
                <RadioGroup
                  value={formData.condition}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    condition: value
                  }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'excellent', label: 'Excellent', desc: 'Like new, no issues', color: 'from-green-400 to-emerald-500' },
                    { value: 'good', label: 'Good', desc: 'Minor wear, well maintained', color: 'from-blue-400 to-cyan-500' },
                    { value: 'fair', label: 'Fair', desc: 'Some damage, needs attention', color: 'from-yellow-400 to-orange-500' },
                    { value: 'poor', label: 'Poor', desc: 'Significant issues', color: 'from-red-400 to-pink-500' }
                  ].map((option) => (
                    <div key={option.value} className="relative">
                      <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        formData.condition === option.value
                          ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg transform scale-105`
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.value}
                          className={formData.condition === option.value ? 'border-white bg-white' : ''}
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={option.value} 
                            className={`font-semibold cursor-pointer ${
                              formData.condition === option.value ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {option.label}
                          </Label>
                          <p className={`text-sm ${
                            formData.condition === option.value ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <Minus className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button onClick={handleComplete} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4" />
                Complete Valuation
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
