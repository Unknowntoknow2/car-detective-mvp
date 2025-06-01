
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Shield, Car, Smartphone, Home } from 'lucide-react';
import { FollowUpAnswers, VEHICLE_FEATURES } from '@/types/follow-up-answers';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const featureCategories = {
  comfort: {
    icon: Home,
    name: 'Comfort & Convenience',
    features: [
      { value: 'leather_seats', label: 'Leather Seats', impact: 800 },
      { value: 'heated_seats', label: 'Heated Seats', impact: 300 },
      { value: 'cooled_seats', label: 'Cooled/Ventilated Seats', impact: 500 },
      { value: 'power_seats', label: 'Power Driver Seat', impact: 200 },
      { value: 'memory_seats', label: 'Memory Seats', impact: 400 },
      { value: 'keyless_entry', label: 'Keyless Entry', impact: 150 }
    ]
  },
  technology: {
    icon: Smartphone,
    name: 'Technology & Infotainment',
    features: [
      { value: 'navigation', label: 'Navigation System', impact: 500 },
      { value: 'bluetooth', label: 'Bluetooth Connectivity', impact: 100 },
      { value: 'premium_audio', label: 'Premium Audio System', impact: 700 },
      { value: 'apple_carplay', label: 'Apple CarPlay/Android Auto', impact: 300 },
      { value: 'wireless_charging', label: 'Wireless Phone Charging', impact: 200 },
      { value: 'wifi_hotspot', label: 'Wi-Fi Hotspot', impact: 250 }
    ]
  },
  safety: {
    icon: Shield,
    name: 'Safety & Driver Assistance',
    features: [
      { value: 'backup_camera', label: 'Backup Camera', impact: 400 },
      { value: 'blind_spot_monitor', label: 'Blind Spot Monitoring', impact: 600 },
      { value: 'lane_keep_assist', label: 'Lane Keep Assist', impact: 500 },
      { value: 'adaptive_cruise', label: 'Adaptive Cruise Control', impact: 800 },
      { value: 'automatic_emergency_braking', label: 'Automatic Emergency Braking', impact: 700 },
      { value: 'parking_sensors', label: 'Parking Sensors', impact: 300 }
    ]
  },
  exterior: {
    icon: Car,
    name: 'Exterior Features',
    features: [
      { value: 'sunroof', label: 'Sunroof/Moonroof', impact: 600 },
      { value: 'alloy_wheels', label: 'Alloy Wheels', impact: 400 },
      { value: 'roof_rails', label: 'Roof Rails/Rack', impact: 200 },
      { value: 'tow_package', label: 'Towing Package', impact: 500 },
      { value: 'running_boards', label: 'Running Boards/Side Steps', impact: 300 },
      { value: 'premium_paint', label: 'Premium Paint/Metallic', impact: 250 }
    ]
  }
};

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (feature: {value: string; label: string; impact: number}, checked: boolean) => {
    if (checked) {
      const newFeatures = [...selectedFeatures, feature];
      updateFormData({ features: newFeatures });
    } else {
      const newFeatures = selectedFeatures.filter(f => f.value !== feature.value);
      updateFormData({ features: newFeatures });
    }
  };

  const calculateTotalImpact = () => {
    return selectedFeatures.reduce((total, feature) => total + (feature.impact || 0), 0);
  };

  const isFeatureSelected = (featureValue: string) => {
    return selectedFeatures.some(f => f.value === featureValue);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Features</h2>
          <p className="text-gray-600">Select features that add value to your vehicle</p>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="space-y-4">
        {Object.entries(featureCategories).map(([categoryKey, category]) => {
          const Icon = category.icon;
          return (
            <Collapsible key={categoryKey} defaultOpen>
              <Card className="border-gray-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span>{category.name}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.features.map((feature) => {
                        const isSelected = isFeatureSelected(feature.value);
                        
                        return (
                          <div 
                            key={feature.value} 
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => handleFeatureToggle(feature, !isSelected)}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={feature.value}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleFeatureToggle(feature, !!checked)}
                              />
                              <Label htmlFor={feature.value} className="cursor-pointer font-medium">
                                {feature.label}
                              </Label>
                            </div>
                            <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                              +${feature.impact}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {/* Selected Features Summary */}
      {selectedFeatures.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Zap className="h-5 w-5 mr-2" />
              Selected Features ({selectedFeatures.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map((feature) => (
                  <Badge key={feature.value} variant="outline" className="bg-white">
                    {feature.label}
                    <span className="ml-1 text-green-600">+${feature.impact}</span>
                  </Badge>
                ))}
              </div>
              
              <div className="pt-3 border-t border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-700">Total Estimated Value Impact:</span>
                  <span className="text-2xl font-bold text-green-600">+${calculateTotalImpact().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
