
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, Car, Music } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const FEATURE_OPTIONS = [
  { id: 'leather-seats', label: 'Leather Seats', category: 'Interior', value: 500 },
  { id: 'sunroof', label: 'Sunroof/Moonroof', category: 'Exterior', value: 800 },
  { id: 'navigation', label: 'Navigation System', category: 'Technology', value: 600 },
  { id: 'backup-camera', label: 'Backup Camera', category: 'Safety', value: 300 },
  { id: 'heated-seats', label: 'Heated Seats', category: 'Comfort', value: 400 },
  { id: 'bluetooth', label: 'Bluetooth Connectivity', category: 'Technology', value: 200 },
  { id: 'cruise-control', label: 'Cruise Control', category: 'Convenience', value: 250 },
  { id: 'alloy-wheels', label: 'Alloy Wheels', category: 'Exterior', value: 600 },
  { id: 'premium-audio', label: 'Premium Audio System', category: 'Entertainment', value: 700 },
  { id: 'keyless-entry', label: 'Keyless Entry', category: 'Convenience', value: 300 },
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    const currentFeatures = formData.features || [];
    
    if (checked) {
      updateFormData({ features: [...currentFeatures, featureId] });
    } else {
      updateFormData({ features: currentFeatures.filter((f: string) => f !== featureId) });
    }
  };

  const selectedFeatures = formData.features || [];
  const totalValue = selectedFeatures.reduce((sum, featureId) => {
    const feature = FEATURE_OPTIONS.find(f => f.id === featureId);
    return sum + (feature?.value || 0);
  }, 0);

  const groupedFeatures = FEATURE_OPTIONS.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof FEATURE_OPTIONS>);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Features & Options</h2>
          <p className="text-gray-600 text-lg">Select all features and options your vehicle has</p>
        </div>
      </div>

      {/* Total Value Summary */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-purple-700 text-xl">
            <Sparkles className="h-6 w-6 mr-3" />
            Selected Features Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700">
            +${totalValue.toLocaleString()}
          </div>
          <p className="text-purple-600 mt-2">
            {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
          </p>
        </CardContent>
      </Card>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <Card key={category} className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-purple-700 text-lg">
                {category === 'Interior' && <Car className="h-5 w-5 mr-2" />}
                {category === 'Entertainment' && <Music className="h-5 w-5 mr-2" />}
                {category !== 'Interior' && category !== 'Entertainment' && <Sparkles className="h-5 w-5 mr-2" />}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, !!checked)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={feature.id} className="font-medium cursor-pointer">
                      {feature.label}
                    </Label>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    +${feature.value}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
