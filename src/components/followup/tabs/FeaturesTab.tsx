
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Shield, Car } from 'lucide-react';
import { FollowUpAnswers, VEHICLE_FEATURES } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  onFeaturesChange: (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => void;
}

export function FeaturesTab({ formData, onFeaturesChange }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (feature: {value: string; label: string; icon?: string; impact?: number}, checked: boolean) => {
    if (checked) {
      const newFeatures = [...selectedFeatures, feature];
      onFeaturesChange(newFeatures);
    } else {
      const newFeatures = selectedFeatures.filter(f => f.value !== feature.value);
      onFeaturesChange(newFeatures);
    }
  };

  const calculateTotalImpact = () => {
    return selectedFeatures.reduce((total, feature) => total + (feature.impact || 0), 0);
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VEHICLE_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.some(f => f.value === feature.value);
          
          return (
            <Card 
              key={feature.value} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleFeatureToggle(feature, !isSelected)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={feature.value}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, !!checked)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {feature.icon && <span className="text-lg">{feature.icon}</span>}
                      <Label htmlFor={feature.value} className="cursor-pointer font-medium">
                        {feature.label}
                      </Label>
                    </div>
                    {feature.impact && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        +${feature.impact}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map((feature) => (
                  <Badge key={feature.value} variant="outline" className="bg-white">
                    {feature.icon && <span className="mr-1">{feature.icon}</span>}
                    {feature.label}
                    {feature.impact && <span className="ml-1 text-green-600">+${feature.impact}</span>}
                  </Badge>
                ))}
              </div>
              
              <div className="pt-2 border-t border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  Total Estimated Value Impact: +${calculateTotalImpact()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Feature Value Impact</h4>
              <p className="text-sm text-gray-600 mt-1">
                Premium features and options can significantly increase your vehicle's market value. 
                The impact varies based on vehicle type, market demand, and feature popularity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
