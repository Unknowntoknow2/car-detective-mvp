
import { VehicleFeature } from './types';

const FEATURE_VALUE_CAP = 0.15;

export function getPremiumFeaturesAdjustment(features: string[], basePrice: number): number {
  const premiumFeatures: VehicleFeature[] = [
    { name: 'leather seats', value: 0.02, description: 'Leather upholstery' },
    { name: 'sunroof', value: 0.015, description: 'Sunroof or moonroof' },
    { name: 'navigation', value: 0.01, description: 'Built-in navigation system' },
    { name: 'premium audio', value: 0.02, description: 'Premium audio system' },
    { name: 'adaptive cruise', value: 0.02, description: 'Adaptive cruise control' },
    { name: 'blind spot', value: 0.01, description: 'Blind spot monitoring' },
    { name: 'heated seats', value: 0.01, description: 'Heated seats' },
    { name: '360 camera', value: 0.02, description: '360-degree camera system' }
  ];

  let totalAdjustment = 0;
  
  features.forEach(feature => {
    const featureData = premiumFeatures.find(f => 
      f.name.toLowerCase() === feature.toLowerCase()
    );
    
    if (featureData) {
      totalAdjustment += basePrice * featureData.value;
    }
  });
  
  return Math.min(totalAdjustment, basePrice * FEATURE_VALUE_CAP);
}
