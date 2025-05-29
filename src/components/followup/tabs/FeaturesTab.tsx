
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Star, Car, Music, Shield, Sun, Zap } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const featureCategories = [
  {
    name: 'Comfort & Convenience',
    icon: Sun,
    color: 'emerald',
    features: [
      'Leather Seats',
      'Heated Seats',
      'Cooled/Ventilated Seats',
      'Power Seats',
      'Memory Seats',
      'Sunroof/Moonroof',
      'Panoramic Roof',
      'Keyless Entry',
      'Push Button Start',
      'Remote Start',
      'Dual Zone Climate Control',
      'Heated Steering Wheel'
    ]
  },
  {
    name: 'Technology & Entertainment',
    icon: Music,
    color: 'blue',
    features: [
      'Navigation System',
      'Premium Audio System',
      'Apple CarPlay/Android Auto',
      'Bluetooth Connectivity',
      'Wireless Phone Charging',
      'WiFi Hotspot',
      'Premium Sound System',
      'Rear Entertainment System',
      'Digital Instrument Cluster',
      'Heads-Up Display'
    ]
  },
  {
    name: 'Safety & Driver Assistance',
    icon: Shield,
    color: 'red',
    features: [
      'Backup Camera',
      'Blind Spot Monitoring',
      'Lane Departure Warning',
      'Lane Keep Assist',
      'Adaptive Cruise Control',
      'Forward Collision Warning',
      'Automatic Emergency Braking',
      'Parking Sensors',
      '360-Degree Camera',
      'Cross Traffic Alert',
      'Driver Attention Monitor',
      'Night Vision'
    ]
  },
  {
    name: 'Performance & Drivetrain',
    icon: Zap,
    color: 'orange',
    features: [
      'All-Wheel Drive (AWD)',
      'Four-Wheel Drive (4WD)',
      'Turbocharged Engine',
      'Supercharged Engine',
      'Sport Mode',
      'Paddle Shifters',
      'Limited Slip Differential',
      'Air Suspension',
      'Adaptive Suspension',
      'Sport Exhaust',
      'Performance Tires',
      'Brembo Brakes'
    ]
  },
  {
    name: 'Exterior & Utility',
    icon: Car,
    color: 'purple',
    features: [
      'Alloy Wheels',
      'Premium Wheels',
      'Running Boards',
      'Roof Rack',
      'Towing Package',
      'Trailer Hitch',
      'Power Liftgate',
      'Hands-Free Liftgate',
      'Bed Liner (Trucks)',
      'Tonneau Cover (Trucks)',
      'Third Row Seating',
      'Captains Chairs'
    ]
  }
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...selectedFeatures, feature]
      : selectedFeatures.filter(f => f !== feature);
    
    updateFormData({ features: updatedFeatures });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'border-emerald-200 bg-emerald-50/50 text-emerald-700';
      case 'blue':
        return 'border-blue-200 bg-blue-50/50 text-blue-700';
      case 'red':
        return 'border-red-200 bg-red-50/50 text-red-700';
      case 'orange':
        return 'border-orange-200 bg-orange-50/50 text-orange-700';
      case 'purple':
        return 'border-purple-200 bg-purple-50/50 text-purple-700';
      default:
        return 'border-gray-200 bg-gray-50/50 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Star className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vehicle Features</h2>
          <p className="text-gray-600 text-lg">Select features that your vehicle has to impact valuation</p>
        </div>
      </div>

      {/* Selected Features Summary */}
      {selectedFeatures.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-emerald-700 text-lg">
              <Star className="h-5 w-5 mr-2" />
              Selected Features ({selectedFeatures.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                >
                  {feature}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Categories */}
      <div className="space-y-6">
        {featureCategories.map((category) => {
          const IconComponent = category.icon;
          const colorClasses = getColorClasses(category.color);
          
          return (
            <Card key={category.name} className={`${colorClasses} h-fit`}>
              <CardHeader className="pb-4">
                <CardTitle className={`flex items-center text-xl ${category.color === 'emerald' ? 'text-emerald-700' : 
                  category.color === 'blue' ? 'text-blue-700' :
                  category.color === 'red' ? 'text-red-700' :
                  category.color === 'orange' ? 'text-orange-700' :
                  'text-purple-700'}`}>
                  <IconComponent className="h-6 w-6 mr-3" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3 p-3 bg-white rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-colors">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureToggle(feature, !!checked)}
                        className="h-5 w-5"
                      />
                      <Label
                        htmlFor={`feature-${feature}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Value Impact Note */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Feature Impact on Value</h4>
              <p className="text-sm text-yellow-700">
                Premium features can significantly increase your vehicle's value. Features like all-wheel drive, 
                navigation systems, and safety technologies are particularly valuable in the resale market. 
                Select all features that apply to get the most accurate valuation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
