
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Smartphone, Car, Zap, TrendingUp } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const featureCategories = [
  {
    category: 'Safety & Security',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    features: [
      { value: 'backup_camera', label: 'Backup Camera', impact: '+$1,200' },
      { value: 'blind_spot_monitoring', label: 'Blind Spot Monitoring', impact: '+$1,800' },
      { value: 'lane_departure_warning', label: 'Lane Departure Warning', impact: '+$1,500' },
      { value: 'adaptive_cruise_control', label: 'Adaptive Cruise Control', impact: '+$2,200' },
      { value: 'automatic_emergency_braking', label: 'Automatic Emergency Braking', impact: '+$2,000' },
      { value: 'security_system', label: 'Security System/Alarm', impact: '+$800' },
      { value: 'remote_start', label: 'Remote Start', impact: '+$1,000' }
    ]
  },
  {
    category: 'Comfort & Convenience',
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      { value: 'leather_seats', label: 'Leather Seats', impact: '+$2,500' },
      { value: 'heated_seats', label: 'Heated Seats', impact: '+$1,200' },
      { value: 'cooled_seats', label: 'Cooled/Ventilated Seats', impact: '+$1,800' },
      { value: 'power_seats', label: 'Power Seats', impact: '+$1,000' },
      { value: 'sunroof', label: 'Sunroof/Moonroof', impact: '+$2,000' },
      { value: 'navigation', label: 'Navigation System', impact: '+$1,500' },
      { value: 'premium_sound', label: 'Premium Sound System', impact: '+$1,800' },
      { value: 'wireless_charging', label: 'Wireless Charging', impact: '+$600' }
    ]
  },
  {
    category: 'Technology',
    icon: Smartphone,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      { value: 'apple_carplay', label: 'Apple CarPlay', impact: '+$800' },
      { value: 'android_auto', label: 'Android Auto', impact: '+$800' },
      { value: 'touchscreen', label: 'Touchscreen Display', impact: '+$1,200' },
      { value: 'wifi_hotspot', label: 'WiFi Hotspot', impact: '+$600' },
      { value: 'premium_audio', label: 'Premium Audio', impact: '+$2,000' },
      { value: 'heads_up_display', label: 'Head-Up Display', impact: '+$1,500' },
      { value: 'digital_cluster', label: 'Digital Instrument Cluster', impact: '+$1,200' }
    ]
  },
  {
    category: 'Performance',
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    features: [
      { value: 'sport_mode', label: 'Sport Mode', impact: '+$800' },
      { value: 'all_wheel_drive', label: 'All-Wheel Drive', impact: '+$3,000' },
      { value: 'turbo_supercharged', label: 'Turbo/Supercharged', impact: '+$2,500' },
      { value: 'performance_suspension', label: 'Performance Suspension', impact: '+$1,500' },
      { value: 'premium_wheels', label: 'Premium Wheels', impact: '+$1,200' },
      { value: 'tow_package', label: 'Tow Package', impact: '+$1,800' }
    ]
  }
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = checked 
      ? [...currentFeatures, feature]
      : currentFeatures.filter(f => f !== feature);
    
    updateFormData({ features: updatedFeatures });
  };

  const selectedFeatures = formData.features || [];
  const totalValueAdd = selectedFeatures.length * 1200; // Approximate average

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Vehicle Features
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Select all features that your vehicle has. These can significantly impact your vehicle's value.
            </p>
            {selectedFeatures.length > 0 && (
              <div className="text-sm font-medium text-green-600">
                Estimated Value Add: +${totalValueAdd.toLocaleString()}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureCategories.map((category) => {
            const IconComponent = category.icon;
            const categoryFeatures = category.features.filter(feature => 
              selectedFeatures.includes(feature.value)
            );
            
            return (
              <Card key={category.category} className={`${category.borderColor} ${category.bgColor}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg flex items-center gap-2 ${category.color}`}>
                    <IconComponent className="w-5 h-5" />
                    {category.category}
                    {categoryFeatures.length > 0 && (
                      <span className="ml-auto text-sm font-normal">
                        {categoryFeatures.length} selected
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.features.map((feature) => {
                      const isSelected = selectedFeatures.includes(feature.value);
                      
                      return (
                        <div
                          key={feature.value}
                          className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                            isSelected 
                              ? 'bg-white border-blue-300 shadow-sm' 
                              : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={feature.value}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleFeatureChange(feature.value, checked as boolean)}
                            />
                            <Label htmlFor={feature.value} className="cursor-pointer font-medium">
                              {feature.label}
                            </Label>
                          </div>
                          <div className="text-xs font-medium text-green-600">
                            {feature.impact}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {selectedFeatures.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Selected Features Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selectedFeatures.map((featureValue) => {
                const feature = featureCategories
                  .flatMap(cat => cat.features)
                  .find(f => f.value === featureValue);
                
                return feature ? (
                  <div key={featureValue} className="text-sm text-green-700">
                    <span className="font-medium">{feature.label}</span>
                    <span className="ml-1 text-green-600">{feature.impact}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="text-lg font-semibold text-green-800">
                Total Estimated Value Addition: +${totalValueAdd.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 mt-1">
                *Actual value impact may vary based on market conditions and vehicle specifics
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
