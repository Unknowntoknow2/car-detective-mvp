
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Star } from 'lucide-react';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const featureCategories = {
  'Safety & Security': [
    'Backup Camera',
    'Blind Spot Monitoring',
    'Lane Departure Warning',
    'Adaptive Cruise Control',
    'Automatic Emergency Braking',
    'Security System/Alarm',
    'Remote Start'
  ],
  'Comfort & Convenience': [
    'Leather Seats',
    'Heated Seats',
    'Cooled/Ventilated Seats',
    'Power Seats',
    'Sunroof/Moonroof',
    'Navigation System',
    'Premium Sound System',
    'Wireless Charging'
  ],
  'Technology': [
    'Apple CarPlay',
    'Android Auto',
    'Touchscreen Display',
    'WiFi Hotspot',
    'Premium Audio',
    'Head-Up Display',
    'Digital Instrument Cluster'
  ],
  'Performance': [
    'Sport Mode',
    'All-Wheel Drive',
    'Turbo/Supercharged',
    'Performance Suspension',
    'Premium Wheels',
    'Tow Package'
  ]
};

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = formData.features || [];
    let updatedFeatures;
    
    if (checked) {
      updatedFeatures = [...currentFeatures, feature];
    } else {
      updatedFeatures = currentFeatures.filter(f => f !== feature);
    }
    
    updateFormData({ features: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Vehicle Features
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select all features that your vehicle has. These can significantly impact your vehicle's value.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(featureCategories).map(([category, features]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features?.includes(feature) || false}
                        onCheckedChange={(checked) => 
                          handleFeatureChange(feature, checked as boolean)
                        }
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
