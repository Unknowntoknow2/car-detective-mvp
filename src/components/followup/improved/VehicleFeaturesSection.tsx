
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Star, Zap, Shield, Music } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  category: string;
  valueImpact: number; // percentage
  description: string;
}

interface VehicleFeaturesSectionProps {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}

const featureCategories = [
  {
    id: 'comfort',
    name: 'Comfort & Convenience',
    icon: Star,
    features: [
      { id: 'leather_seats', name: 'Leather Seats', valueImpact: 3, description: 'Premium leather upholstery' },
      { id: 'heated_seats', name: 'Heated Seats', valueImpact: 2, description: 'Front seat heating' },
      { id: 'cooled_seats', name: 'Cooled/Ventilated Seats', valueImpact: 2.5, description: 'Seat ventilation system' },
      { id: 'memory_seats', name: 'Memory Seats', valueImpact: 1.5, description: 'Power seat memory settings' },
      { id: 'sunroof', name: 'Sunroof/Moonroof', valueImpact: 2, description: 'Power sunroof or moonroof' },
      { id: 'keyless_entry', name: 'Keyless Entry/Start', valueImpact: 1, description: 'Push button start and keyless entry' },
      { id: 'remote_start', name: 'Remote Start', valueImpact: 1.5, description: 'Remote engine start capability' },
      { id: 'climate_zones', name: 'Dual/Tri-Zone Climate', valueImpact: 1.5, description: 'Multi-zone climate control' }
    ]
  },
  {
    id: 'technology',
    name: 'Technology & Entertainment',
    icon: Music,
    features: [
      { id: 'premium_audio', name: 'Premium Audio System', valueImpact: 2, description: 'High-end audio system (Bose, Harman Kardon, etc.)' },
      { id: 'navigation', name: 'Built-in Navigation', valueImpact: 1.5, description: 'Factory navigation system' },
      { id: 'large_screen', name: 'Large Touchscreen (10"+)', valueImpact: 2, description: 'Large infotainment display' },
      { id: 'wireless_charging', name: 'Wireless Charging', valueImpact: 1, description: 'Wireless phone charging pad' },
      { id: 'head_up_display', name: 'Head-Up Display', valueImpact: 2, description: 'Windshield projection display' },
      { id: 'premium_connectivity', name: 'Premium Connectivity', valueImpact: 1, description: 'WiFi hotspot, premium services' }
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Driver Assistance',
    icon: Shield,
    features: [
      { id: 'adaptive_cruise', name: 'Adaptive Cruise Control', valueImpact: 2, description: 'Speed and distance maintaining cruise control' },
      { id: 'lane_assist', name: 'Lane Keep Assist', valueImpact: 1.5, description: 'Lane departure warning and assistance' },
      { id: 'blind_spot', name: 'Blind Spot Monitoring', valueImpact: 1.5, description: 'Blind spot detection with alerts' },
      { id: 'backup_camera', name: 'Backup Camera', valueImpact: 1, description: 'Rear view camera system' },
      { id: 'surround_camera', name: '360° Camera System', valueImpact: 2.5, description: 'Surround view camera system' },
      { id: 'parking_sensors', name: 'Parking Sensors', valueImpact: 1, description: 'Front and rear parking sensors' },
      { id: 'auto_parking', name: 'Automatic Parking', valueImpact: 2, description: 'Self-parking capability' },
      { id: 'collision_avoidance', name: 'Collision Avoidance', valueImpact: 2, description: 'Automatic emergency braking' }
    ]
  },
  {
    id: 'performance',
    name: 'Performance & Drivetrain',
    icon: Zap,
    features: [
      { id: 'awd', name: 'All-Wheel Drive', valueImpact: 4, description: 'AWD or 4WD system' },
      { id: 'sport_mode', name: 'Sport/Performance Mode', valueImpact: 1.5, description: 'Selectable driving modes' },
      { id: 'air_suspension', name: 'Air Suspension', valueImpact: 3, description: 'Adaptive air suspension system' },
      { id: 'limited_slip', name: 'Limited Slip Differential', valueImpact: 2, description: 'Performance differential' },
      { id: 'tow_package', name: 'Towing Package', valueImpact: 2.5, description: 'Heavy duty towing equipment' },
      { id: 'performance_tires', name: 'Performance Tires', valueImpact: 1.5, description: 'High-performance tire package' }
    ]
  }
];

export function VehicleFeaturesSection({ selectedFeatures, onChange }: VehicleFeaturesSectionProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['comfort']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleFeature = (featureId: string) => {
    onChange(
      selectedFeatures.includes(featureId)
        ? selectedFeatures.filter(id => id !== featureId)
        : [...selectedFeatures, featureId]
    );
  };

  const calculateTotalImpact = () => {
    return featureCategories
      .flatMap(cat => cat.features)
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.valueImpact, 0);
  };

  const selectedCount = selectedFeatures.length;
  const totalImpact = calculateTotalImpact();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Vehicle Features</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select all features your vehicle has
            </p>
          </div>
          <div className="text-right">
            <Badge variant="default" className="mb-1">
              {selectedCount} selected
            </Badge>
            <div className="text-sm font-medium text-green-600">
              +{totalImpact.toFixed(1)}% value impact
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {featureCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          const categorySelectedCount = category.features.filter(f => selectedFeatures.includes(f.id)).length;

          return (
            <div key={category.id} className="border rounded-lg">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{category.name}</span>
                  {categorySelectedCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {categorySelectedCount} selected
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t bg-gray-50/50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.features.map((feature) => {
                      const isSelected = selectedFeatures.includes(feature.id);
                      
                      return (
                        <div
                          key={feature.id}
                          className={`
                            flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleFeature(feature.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{feature.name}</h4>
                              <Badge variant="outline" className="text-xs text-green-600">
                                +{feature.valueImpact}%
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {selectedCount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-green-800">Features Impact Summary</h4>
                <p className="text-sm text-green-600">
                  {selectedCount} features selected • Estimated +{totalImpact.toFixed(1)}% value increase
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange([])}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
