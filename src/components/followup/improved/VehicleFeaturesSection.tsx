
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface VehicleFeaturesSectionProps {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}

const vehicleFeatures = [
  { id: 'leather_seats', name: 'Leather Seats', category: 'Interior', value: 1200 },
  { id: 'sunroof', name: 'Sunroof/Moonroof', category: 'Exterior', value: 800 },
  { id: 'navigation', name: 'Navigation System', category: 'Technology', value: 600 },
  { id: 'heated_seats', name: 'Heated Seats', category: 'Comfort', value: 500 },
  { id: 'bluetooth', name: 'Bluetooth', category: 'Technology', value: 200 },
  { id: 'backup_camera', name: 'Backup Camera', category: 'Safety', value: 400 },
  { id: 'remote_start', name: 'Remote Start', category: 'Convenience', value: 300 },
  { id: 'third_row', name: 'Third Row Seating', category: 'Capacity', value: 1000 },
  { id: 'blind_spot', name: 'Blind Spot Monitoring', category: 'Safety', value: 600 },
  { id: 'carplay', name: 'Apple CarPlay/Android Auto', category: 'Technology', value: 400 },
  { id: 'lane_departure', name: 'Lane Departure Warning', category: 'Safety', value: 500 },
  { id: 'keyless_entry', name: 'Keyless Entry', category: 'Convenience', value: 250 },
  { id: 'adaptive_cruise', name: 'Adaptive Cruise Control', category: 'Safety', value: 800 },
  { id: 'premium_audio', name: 'Premium Audio System', category: 'Technology', value: 700 },
  { id: 'parking_sensors', name: 'Parking Sensors', category: 'Safety', value: 350 },
  { id: 'heads_up_display', name: 'Heads-up Display', category: 'Technology', value: 600 },
  { id: 'premium_wheels', name: 'Premium Wheels', category: 'Exterior', value: 800 },
  { id: 'towing_package', name: 'Towing Package', category: 'Utility', value: 600 },
  { id: 'cooled_seats', name: 'Cooled/Ventilated Seats', category: 'Comfort', value: 700 },
  { id: 'panoramic_roof', name: 'Panoramic Roof', category: 'Exterior', value: 1200 }
];

const categories = [
  'Interior', 'Exterior', 'Technology', 'Safety', 'Comfort', 'Convenience', 'Capacity', 'Utility'
];

export function VehicleFeaturesSection({ selectedFeatures, onChange }: VehicleFeaturesSectionProps) {
  const handleFeatureToggle = (featureId: string) => {
    const isSelected = selectedFeatures.includes(featureId);
    if (isSelected) {
      onChange(selectedFeatures.filter(id => id !== featureId));
    } else {
      onChange([...selectedFeatures, featureId]);
    }
  };

  const getTotalValue = () => {
    return vehicleFeatures
      .filter(feature => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.value, 0);
  };

  const getFeaturesByCategory = (category: string) => {
    return vehicleFeatures.filter(feature => feature.category === category);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Vehicle Features</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select all features your vehicle has to get accurate valuation
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Added Value</div>
            <div className="text-2xl font-bold text-green-600">
              ${getTotalValue().toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {categories.map(category => {
          const categoryFeatures = getFeaturesByCategory(category);
          if (categoryFeatures.length === 0) return null;
          
          return (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-gray-900 border-b pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryFeatures.map(feature => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <div
                      key={feature.id}
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleFeatureToggle(feature.id)}
                        />
                        <span className="text-sm font-medium">{feature.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        +${feature.value}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
