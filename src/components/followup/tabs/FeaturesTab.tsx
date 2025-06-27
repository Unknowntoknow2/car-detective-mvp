
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const featureCategories = [
  {
    category: 'Comfort & Convenience',
    features: [
      { value: 'leather_seats', label: 'Leather Seats', desc: 'Premium leather upholstery' },
      { value: 'heated_seats', label: 'Heated Seats', desc: 'Front or rear heated seats' },
      { value: 'ventilated_seats', label: 'Ventilated Seats', desc: 'Cooled/ventilated seating' },
      { value: 'power_seats', label: 'Power Seats', desc: 'Electrically adjustable seats' },
      { value: 'memory_seats', label: 'Memory Seats', desc: 'Programmable seat positions' },
      { value: 'sunroof', label: 'Sunroof/Moonroof', desc: 'Panoramic or standard sunroof' },
      { value: 'dual_climate', label: 'Dual Climate Control', desc: 'Separate temperature zones' }
    ]
  },
  {
    category: 'Technology & Entertainment',
    features: [
      { value: 'navigation', label: 'Navigation System', desc: 'Built-in GPS navigation' },
      { value: 'premium_audio', label: 'Premium Audio', desc: 'High-end sound system' },
      { value: 'apple_carplay', label: 'Apple CarPlay', desc: 'Smartphone integration' },
      { value: 'android_auto', label: 'Android Auto', desc: 'Google smartphone integration' },
      { value: 'wireless_charging', label: 'Wireless Charging', desc: 'Qi wireless phone charging' },
      { value: 'head_up_display', label: 'Head-Up Display', desc: 'Windshield information display' },
      { value: 'digital_cluster', label: 'Digital Instrument Cluster', desc: 'LCD/OLED gauge cluster' }
    ]
  },
  {
    category: 'Safety & Driver Assistance',
    features: [
      { value: 'backup_camera', label: 'Backup Camera', desc: 'Rear view camera system' },
      { value: 'blind_spot', label: 'Blind Spot Monitoring', desc: 'Side mirror warning system' },
      { value: 'lane_keeping', label: 'Lane Keeping Assist', desc: 'Automatic lane centering' },
      { value: 'adaptive_cruise', label: 'Adaptive Cruise Control', desc: 'Distance-maintaining cruise' },
      { value: 'parking_sensors', label: 'Parking Sensors', desc: 'Proximity warning sensors' },
      { value: 'automatic_braking', label: 'Automatic Emergency Braking', desc: 'Collision avoidance system' },
      { value: 'surround_view', label: '360° Surround View', desc: 'Top-down camera view' }
    ]
  },
  {
    category: 'Performance & Handling',
    features: [
      { value: 'sport_mode', label: 'Sport Mode', desc: 'Performance driving mode' },
      { value: 'adaptive_suspension', label: 'Adaptive Suspension', desc: 'Adjustable damping system' },
      { value: 'limited_slip', label: 'Limited Slip Differential', desc: 'Enhanced traction control' },
      { value: 'performance_tires', label: 'Performance Tires', desc: 'High-performance tire package' },
      { value: 'sport_exhaust', label: 'Sport Exhaust', desc: 'Performance exhaust system' },
      { value: 'paddle_shifters', label: 'Paddle Shifters', desc: 'Steering wheel gear controls' }
    ]
  }
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const features = formData.features || [];
  const additionalNotes = formData.additional_notes || '';

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked 
      ? [...features, feature]
      : features.filter(f => f !== feature);
    
    updateFormData({ features: updatedFeatures });
  };

  const handleNotesChange = (notes: string) => {
    updateFormData({ additional_notes: notes });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Premium Features & Options
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select any premium features, options, or packages your vehicle has
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{category.category}</h3>
                <p className="text-sm text-gray-600">Select applicable features from this category</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.features.map((feature) => {
                  const isChecked = features.includes(feature.value);
                  
                  return (
                    <div
                      key={feature.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        isChecked
                          ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleFeatureChange(feature.value, !isChecked)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => handleFeatureChange(feature.value, checked === true)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <Label className="cursor-pointer font-medium text-blue-700">
                            {feature.label}
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Additional Notes */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="additional-notes" className="text-base font-medium">
                Additional Notes
              </Label>
              <p className="text-sm text-gray-600">
                Any other features, options, or details about your vehicle
              </p>
            </div>
            
            <Textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Describe any other features, recent maintenance, or relevant information..."
              className="min-h-[100px]"
            />
          </div>

          {/* Features Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Selected Features Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-700 mb-2">Total Features Selected</div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {features.length}
                  </Badge>
                </div>
                
                {features.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {features.map((featureValue) => {
                      const feature = featureCategories
                        .flatMap(cat => cat.features)
                        .find(f => f.value === featureValue);
                      return feature ? (
                        <Badge key={featureValue} variant="outline" className="text-xs">
                          {feature.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
                
                <div className="p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Value Impact:</strong> Premium features and options can significantly increase your vehicle's value, especially when well-maintained.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
