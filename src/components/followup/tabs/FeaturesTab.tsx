
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

const FEATURE_CATEGORIES = [
  { id: 'technology', label: '📱 Technology', icon: '📱' },
  { id: 'safety', label: '🛡️ Safety & Security', icon: '🛡️' },
  { id: 'climate', label: '❄️ Climate Control', icon: '❄️' },
  { id: 'audio', label: '🎵 Audio & Entertainment', icon: '🎵' },
  { id: 'interior', label: '🪑 Interior Materials', icon: '🪑' },
  { id: 'exterior', label: '🚪 Exterior Features', icon: '🚪' },
  { id: 'luxury', label: '💎 Luxury Materials', icon: '💎' },
  { id: 'adas', label: '🤖 Driver Assistance', icon: '🤖' },
  { id: 'performance', label: '🏎️ Performance Packages', icon: '🏎️' }
];

const FEATURES_BY_CATEGORY = {
  technology: [
    { id: 'navigation_system', name: 'Navigation System', value: 800, impact: 'medium', rarity: 'common' },
    { id: 'smartphone_integration', name: 'Apple CarPlay/Android Auto', value: 600, impact: 'medium', rarity: 'common' },
    { id: 'wireless_charging', name: 'Wireless Phone Charging', value: 400, impact: 'low', rarity: 'premium' },
    { id: 'digital_dashboard', name: 'Digital Instrument Cluster', value: 1200, impact: 'high', rarity: 'premium' },
    { id: 'heads_up_display', name: 'Heads-Up Display', value: 1500, impact: 'high', rarity: 'luxury' },
  ],
  safety: [
    { id: 'backup_camera', name: 'Backup Camera', value: 300, impact: 'low', rarity: 'common' },
    { id: 'blind_spot_monitoring', name: 'Blind Spot Monitoring', value: 800, impact: 'medium', rarity: 'common' },
    { id: 'lane_departure_warning', name: 'Lane Departure Warning', value: 600, impact: 'medium', rarity: 'common' },
    { id: 'forward_collision_warning', name: 'Forward Collision Warning', value: 1000, impact: 'high', rarity: 'premium' },
    { id: 'night_vision', name: 'Night Vision Camera', value: 2000, impact: 'high', rarity: 'luxury' },
  ],
  climate: [
    { id: 'dual_zone_ac', name: 'Dual-Zone Climate Control', value: 500, impact: 'medium', rarity: 'common' },
    { id: 'tri_zone_ac', name: 'Tri-Zone Climate Control', value: 800, impact: 'medium', rarity: 'premium' },
    { id: 'heated_seats', name: 'Heated Front Seats', value: 400, impact: 'medium', rarity: 'common' },
    { id: 'ventilated_seats', name: 'Ventilated Seats', value: 800, impact: 'medium', rarity: 'premium' },
    { id: 'heated_steering_wheel', name: 'Heated Steering Wheel', value: 300, impact: 'low', rarity: 'premium' },
  ],
  audio: [
    { id: 'premium_sound', name: 'Premium Sound System', value: 800, impact: 'medium', rarity: 'common' },
    { id: 'surround_sound', name: 'Surround Sound System', value: 1500, impact: 'high', rarity: 'premium' },
    { id: 'subwoofer', name: 'Subwoofer', value: 400, impact: 'low', rarity: 'common' },
    { id: 'noise_cancellation', name: 'Active Noise Cancellation', value: 1200, impact: 'high', rarity: 'luxury' },
  ],
  interior: [
    { id: 'leather_seats', name: 'Leather Seats', value: 1200, impact: 'high', rarity: 'premium' },
    { id: 'premium_leather', name: 'Premium Leather', value: 2000, impact: 'high', rarity: 'luxury' },
    { id: 'wood_trim', name: 'Wood Trim', value: 600, impact: 'medium', rarity: 'premium' },
    { id: 'carbon_fiber_trim', name: 'Carbon Fiber Trim', value: 1000, impact: 'high', rarity: 'luxury' },
    { id: 'alcantara', name: 'Alcantara Upholstery', value: 1500, impact: 'high', rarity: 'luxury' },
  ],
  exterior: [
    { id: 'sunroof', name: 'Sunroof', value: 800, impact: 'medium', rarity: 'common' },
    { id: 'panoramic_sunroof', name: 'Panoramic Sunroof', value: 1500, impact: 'high', rarity: 'premium' },
    { id: 'alloy_wheels', name: 'Alloy Wheels', value: 600, impact: 'medium', rarity: 'common' },
    { id: 'premium_wheels', name: 'Premium Alloy Wheels', value: 1200, impact: 'high', rarity: 'premium' },
    { id: 'roof_rails', name: 'Roof Rails', value: 300, impact: 'low', rarity: 'common' },
  ],
  luxury: [
    { id: 'massage_seats', name: 'Massage Seats', value: 2500, impact: 'high', rarity: 'luxury' },
    { id: 'executive_seating', name: 'Executive Rear Seating', value: 3000, impact: 'high', rarity: 'luxury' },
    { id: 'ambient_lighting', name: 'Ambient Lighting', value: 500, impact: 'medium', rarity: 'premium' },
    { id: 'soft_close_doors', name: 'Soft-Close Doors', value: 1500, impact: 'high', rarity: 'luxury' },
  ],
  adas: [
    { id: 'adaptive_cruise', name: 'Adaptive Cruise Control', value: 1200, impact: 'high', rarity: 'premium' },
    { id: 'lane_keeping_assist', name: 'Lane Keeping Assist', value: 800, impact: 'medium', rarity: 'premium' },
    { id: 'automatic_parking', name: 'Automatic Parking', value: 1500, impact: 'high', rarity: 'luxury' },
    { id: 'autopilot', name: 'Semi-Autonomous Driving', value: 3000, impact: 'high', rarity: 'luxury' },
  ],
  performance: [
    { id: 'sport_package', name: 'Sport Package', value: 2000, impact: 'high', rarity: 'premium' },
    { id: 'performance_exhaust', name: 'Performance Exhaust', value: 1000, impact: 'medium', rarity: 'premium' },
    { id: 'track_package', name: 'Track Package', value: 3500, impact: 'high', rarity: 'luxury' },
    { id: 'air_suspension', name: 'Air Suspension', value: 2500, impact: 'high', rarity: 'luxury' },
  ]
};

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  baseValue: number;
}

export function FeaturesTab({ formData, updateFormData, baseValue }: FeaturesTabProps) {
  const [activeCategory, setActiveCategory] = useState('technology');

  const selectedFeatures = formData.features || [];
  const totalFeatureValue = calculateEnhancedFeatureValue(selectedFeatures, baseValue);

  const handleFeatureToggle = (featureId: string) => {
    const currentFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    updateFormData({ features: currentFeatures });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'luxury': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'premium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'common': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Features Overview */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <span className="text-2xl">⭐</span>
              Vehicle Features
            </CardTitle>
            {totalFeatureValue.totalAdjustment > 0 && (
              <Badge className="bg-green-500 text-white">
                +${totalFeatureValue.totalAdjustment.toLocaleString()} Value Added
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-700 mb-4">
            Select the features your vehicle has. Each feature may impact the vehicle's value based on market demand and rarity.
          </p>
          
          {selectedFeatures.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>{selectedFeatures.length} features selected</strong> - 
                These premium features can increase your vehicle's market value.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Categories Navigation */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {FEATURE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  "hover:scale-105 transform",
                  activeCategory === category.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES_BY_CATEGORY[activeCategory as keyof typeof FEATURES_BY_CATEGORY]?.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          
          return (
            <Card
              key={feature.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                isSelected 
                  ? "border-blue-400 bg-blue-50 shadow-md" 
                  : "border-gray-200 bg-white hover:border-blue-300"
              )}
              onClick={() => handleFeatureToggle(feature.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="pointer-events-none"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.name}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getImpactColor(feature.impact))}
                    >
                      {feature.impact}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getRarityColor(feature.rarity))}
                    >
                      {feature.rarity}
                    </Badge>
                  </div>
                  <span className="text-green-600 font-semibold">
                    +${feature.value.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
