
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Thermometer, Tv, Shield, Car, Armchair, Package, Star } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

interface Feature {
  value: string;
  label: string;
  impact: number;
}

interface FeatureCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  features: Feature[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'comfort',
    title: 'Comfort & Convenience',
    icon: Thermometer,
    features: [
      { value: 'leather_seats', label: 'Leather Seats', impact: 800 },
      { value: 'heated_seats', label: 'Heated Seats', impact: 300 },
      { value: 'cooled_seats', label: 'Cooled/Ventilated Seats', impact: 400 },
      { value: 'memory_seats', label: 'Memory Seats', impact: 250 },
      { value: 'power_seats', label: 'Power Seats', impact: 200 },
      { value: 'sunroof', label: 'Sunroof/Moonroof', impact: 600 },
      { value: 'dual_climate', label: 'Dual Zone Climate Control', impact: 300 },
      { value: 'remote_start', label: 'Remote Start', impact: 150 },
    ]
  },
  {
    id: 'tech',
    title: 'Tech & Media',
    icon: Tv,
    features: [
      { value: 'navigation', label: 'GPS Navigation System', impact: 500 },
      { value: 'premium_audio', label: 'Premium Audio System', impact: 700 },
      { value: 'bluetooth', label: 'Bluetooth Connectivity', impact: 200 },
      { value: 'apple_carplay', label: 'Apple CarPlay/Android Auto', impact: 300 },
      { value: 'wireless_charging', label: 'Wireless Phone Charging', impact: 150 },
      { value: 'touchscreen', label: 'Large Touchscreen Display', impact: 400 },
      { value: 'wifi_hotspot', label: 'WiFi Hotspot', impact: 200 },
      { value: 'heads_up_display', label: 'Heads-Up Display', impact: 500 },
    ]
  },
  {
    id: 'safety',
    title: 'Safety & Driver Assistance',
    icon: Shield,
    features: [
      { value: 'backup_camera', label: 'Backup Camera', impact: 400 },
      { value: 'blind_spot_monitor', label: 'Blind Spot Monitoring', impact: 300 },
      { value: 'lane_keeping', label: 'Lane Keeping Assist', impact: 350 },
      { value: 'adaptive_cruise', label: 'Adaptive Cruise Control', impact: 600 },
      { value: 'collision_avoidance', label: 'Forward Collision Warning', impact: 400 },
      { value: 'parking_sensors', label: 'Parking Sensors', impact: 250 },
      { value: 'auto_emergency_braking', label: 'Automatic Emergency Braking', impact: 500 },
      { value: 'cross_traffic_alert', label: 'Cross Traffic Alert', impact: 200 },
    ]
  },
  {
    id: 'exterior',
    title: 'Exterior Features',
    icon: Car,
    features: [
      { value: 'alloy_wheels', label: 'Alloy Wheels', impact: 400 },
      { value: 'led_headlights', label: 'LED Headlights', impact: 300 },
      { value: 'fog_lights', label: 'Fog Lights', impact: 150 },
      { value: 'running_boards', label: 'Running Boards/Side Steps', impact: 200 },
      { value: 'roof_rack', label: 'Roof Rack/Rails', impact: 250 },
      { value: 'towing_package', label: 'Towing Package', impact: 500 },
      { value: 'keyless_entry', label: 'Keyless Entry', impact: 200 },
      { value: 'power_liftgate', label: 'Power Liftgate', impact: 400 },
    ]
  },
  {
    id: 'interior',
    title: 'Interior Features',
    icon: Armchair,
    features: [
      { value: 'third_row_seating', label: 'Third Row Seating', impact: 600 },
      { value: 'captain_chairs', label: 'Captain\'s Chairs', impact: 400 },
      { value: 'wood_trim', label: 'Wood Grain Trim', impact: 200 },
      { value: 'ambient_lighting', label: 'Ambient Interior Lighting', impact: 150 },
      { value: 'premium_materials', label: 'Premium Interior Materials', impact: 300 },
      { value: 'floor_mats', label: 'All-Weather Floor Mats', impact: 100 },
      { value: 'cargo_organizer', label: 'Cargo Organizer', impact: 75 },
      { value: 'ski_pass_through', label: 'Ski Pass-Through', impact: 100 },
    ]
  },
  {
    id: 'packages',
    title: 'Option Packages',
    icon: Package,
    features: [
      { value: 'sport_package', label: 'Sport Package', impact: 800 },
      { value: 'luxury_package', label: 'Luxury Package', impact: 1200 },
      { value: 'tech_package', label: 'Technology Package', impact: 900 },
      { value: 'cold_weather_package', label: 'Cold Weather Package', impact: 400 },
      { value: 'towing_package_premium', label: 'Premium Towing Package', impact: 700 },
      { value: 'appearance_package', label: 'Appearance Package', impact: 500 },
      { value: 'off_road_package', label: 'Off-Road Package', impact: 600 },
      { value: 'safety_package', label: 'Safety Package', impact: 800 },
    ]
  }
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(['comfort', 'tech', 'safety']);
  
  const selectedFeatures = formData.features || [];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFeatureToggle = (feature: Feature, checked: boolean) => {
    const updated = checked
      ? [...selectedFeatures, { value: feature.value, label: feature.label, impact: feature.impact }]
      : selectedFeatures.filter(f => f.value !== feature.value);
    
    updateFormData({ features: updated });
  };

  const isFeatureSelected = (featureValue: string) => {
    return selectedFeatures.some(f => f.value === featureValue);
  };

  const totalFeatureValue = selectedFeatures.reduce((sum, feature) => sum + (feature.impact || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Vehicle Features & Options
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select all features and options your vehicle has. Each feature impacts your vehicle's value.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {FEATURE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isOpen = openCategories.includes(category.id);
            const categoryFeatureCount = category.features.filter(f => 
              isFeatureSelected(f.value)
            ).length;

            return (
              <Collapsible key={category.id} open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{category.title}</span>
                    {categoryFeatureCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {categoryFeatureCount} selected
                      </Badge>
                    )}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                    {category.features.map((feature) => (
                      <div key={feature.value} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={feature.value}
                            checked={isFeatureSelected(feature.value)}
                            onCheckedChange={(checked) => handleFeatureToggle(feature, !!checked)}
                          />
                          <Label htmlFor={feature.value} className="cursor-pointer font-medium">
                            {feature.label}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          +${feature.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {/* Total Feature Value */}
          {totalFeatureValue > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-green-800">
                  Total Feature Value Impact:
                </span>
                <span className="text-xl font-bold text-green-600">
                  +${totalFeatureValue.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
