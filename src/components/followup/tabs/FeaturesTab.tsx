
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Shield, Smartphone, Crown, Car, Truck } from 'lucide-react';
import { FollowUpAnswers, FeatureOption } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

interface FeatureCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  features: FeatureOption[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    title: 'Safety & Driver Assistance',
    icon: Shield,
    color: 'border-red-500 text-red-700',
    bgColor: 'bg-red-50',
    features: [
      { id: 'blind_spot_monitor', label: 'Blind Spot Monitor', impact: 400 },
      { id: 'adaptive_cruise_control', label: 'Adaptive Cruise Control', impact: 600 },
      { id: 'lane_keep_assist', label: 'Lane Keep Assist', impact: 350 },
      { id: 'rear_cross_traffic', label: 'Rear Cross Traffic Alert', impact: 300 },
      { id: 'auto_emergency_braking', label: 'Automatic Emergency Braking', impact: 500 },
      { id: 'backup_camera', label: 'Backup Camera', impact: 250 },
      { id: 'parking_sensors', label: 'Parking Sensors', impact: 200 },
      { id: 'collision_warning', label: 'Collision Warning', impact: 400 },
      { id: 'stability_control', label: 'Electronic Stability Control', impact: 300 },
      { id: 'auto_high_beams', label: 'Auto High Beams', impact: 150 }
    ]
  },
  {
    title: 'Tech & Connectivity',
    icon: Smartphone,
    color: 'border-blue-500 text-blue-700',
    bgColor: 'bg-blue-50',
    features: [
      { id: 'apple_carplay', label: 'Apple CarPlay', impact: 400 },
      { id: 'android_auto', label: 'Android Auto', impact: 400 },
      { id: 'navigation_system', label: 'Navigation System', impact: 500 },
      { id: 'touchscreen', label: 'Touchscreen Display', impact: 350 },
      { id: 'bluetooth', label: 'Bluetooth', impact: 200 },
      { id: 'usb_ports', label: 'USB Ports', impact: 150 },
      { id: 'wifi_hotspot', label: 'Wi-Fi Hotspot', impact: 300 },
      { id: 'wireless_charging', label: 'Wireless Charging', impact: 250 },
      { id: 'voice_control', label: 'Voice Control', impact: 200 }
    ]
  },
  {
    title: 'Luxury & Comfort',
    icon: Crown,
    color: 'border-purple-500 text-purple-700',
    bgColor: 'bg-purple-50',
    features: [
      { id: 'leather_seats', label: 'Leather Seats', impact: 800 },
      { id: 'heated_front_seats', label: 'Heated Front Seats', impact: 300 },
      { id: 'heated_rear_seats', label: 'Heated Rear Seats', impact: 400 },
      { id: 'ventilated_seats', label: 'Ventilated Seats', impact: 500 },
      { id: 'dual_climate', label: 'Dual Zone Climate Control', impact: 350 },
      { id: 'power_liftgate', label: 'Power Liftgate', impact: 400 },
      { id: 'remote_start', label: 'Remote Start', impact: 300 },
      { id: 'keyless_entry', label: 'Keyless Entry', impact: 250 },
      { id: 'push_start', label: 'Push Button Start', impact: 200 },
      { id: 'power_seats', label: 'Power Adjustable Seats', impact: 350 },
      { id: 'ambient_lighting', label: 'Ambient Lighting', impact: 200 }
    ]
  },
  {
    title: 'Wheels & Exterior',
    icon: Car,
    color: 'border-green-500 text-green-700',
    bgColor: 'bg-green-50',
    features: [
      { id: 'alloy_wheels', label: 'Alloy Wheels', impact: 400 },
      { id: 'premium_wheels', label: 'Premium Wheels', impact: 600 },
      { id: 'sunroof', label: 'Sunroof', impact: 500 },
      { id: 'moonroof', label: 'Moonroof', impact: 600 },
      { id: 'fog_lights', label: 'Fog Lights', impact: 150 },
      { id: 'roof_rack', label: 'Roof Rack', impact: 250 },
      { id: 'running_boards', label: 'Running Boards', impact: 300 },
      { id: 'led_headlights', label: 'LED Headlights', impact: 400 },
      { id: 'tinted_windows', label: 'Tinted Windows', impact: 200 }
    ]
  },
  {
    title: 'Utility & Towing',
    icon: Truck,
    color: 'border-orange-500 text-orange-700',
    bgColor: 'bg-orange-50',
    features: [
      { id: 'tow_package', label: 'Tow Package', impact: 800 },
      { id: 'trailer_hitch', label: 'Trailer Hitch', impact: 400 },
      { id: 'bed_liner', label: 'Bed Liner', impact: 300 },
      { id: 'awd_4wd', label: '4WD / AWD', impact: 1200 },
      { id: 'offroad_package', label: 'Off-Road Package', impact: 1000 },
      { id: 'skid_plates', label: 'Skid Plates', impact: 200 }
    ]
  }
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const toggleFeature = (featureId: string) => {
    const isSelected = selectedFeatures.includes(featureId);
    const updatedFeatures = isSelected
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    updateFormData({ features: updatedFeatures });
  };

  const calculateCategoryValue = (features: FeatureOption[]) => {
    return features
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.impact, 0);
  };

  const getSelectedCount = (features: FeatureOption[]) => {
    return features.filter(feature => selectedFeatures.includes(feature.id)).length;
  };

  const totalValue = FEATURE_CATEGORIES
    .flatMap(category => category.features)
    .filter(feature => selectedFeatures.includes(feature.id))
    .reduce((total, feature) => total + feature.impact, 0);

  return (
    <div className="space-y-6">
      {/* Total Value Display */}
      {totalValue > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                +${totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">
                Total estimated value from selected features
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Categories */}
      {FEATURE_CATEGORIES.map((category) => {
        const categoryValue = calculateCategoryValue(category.features);
        const selectedCount = getSelectedCount(category.features);
        const IconComponent = category.icon;

        return (
          <Card key={category.title} className={`border-2 ${category.color}`}>
            <CardHeader className={`${category.bgColor} rounded-t-lg`}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5" />
                  <span>{category.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCount}/{category.features.length}
                  </Badge>
                </div>
                {categoryValue > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    +${categoryValue.toLocaleString()}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.features.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  
                  return (
                    <div
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`
                        cursor-pointer border-2 rounded-lg p-3 transition-all duration-200
                        ${isSelected 
                          ? 'bg-green-100 border-green-500 shadow-md transform scale-105' 
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{feature.label}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant={isSelected ? "default" : "secondary"}
                              className="text-xs"
                            >
                              +${feature.impact}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center
                            ${isSelected 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                            }
                          `}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Help Text */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Feature Selection Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Select all features that your vehicle currently has</li>
                <li>• Feature values are estimates and may vary by vehicle condition</li>
                <li>• Popular features like AWD and leather seats add significant value</li>
                <li>• Safety features are increasingly important to buyers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
