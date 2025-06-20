
interface Feature {
  id: string;
  name: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  baseValue: number;
}

const mockFeatures: Feature[] = [
  // Audio features
  { id: 'premium-audio', name: 'Premium Audio System', impact: 'medium', category: 'audio', baseValue: 500 },
  { id: 'subwoofer', name: 'Subwoofer', impact: 'low', category: 'audio', baseValue: 200 },
  
  // Technology features
  { id: 'navigation', name: 'Navigation System', impact: 'medium', category: 'technology', baseValue: 300 },
  { id: 'backup-camera', name: 'Backup Camera', impact: 'medium', category: 'technology', baseValue: 250 },
  
  // ADAS features
  { id: 'adaptive-cruise', name: 'Adaptive Cruise Control', impact: 'high', category: 'adas', baseValue: 800 },
  { id: 'lane-keeping', name: 'Lane Keeping Assist', impact: 'high', category: 'adas', baseValue: 600 },
  
  // Safety features
  { id: 'blind-spot', name: 'Blind Spot Monitoring', impact: 'medium', category: 'safety', baseValue: 400 },
  { id: 'collision-warning', name: 'Forward Collision Warning', impact: 'high', category: 'safety', baseValue: 700 },
  
  // Exterior features
  { id: 'sunroof', name: 'Sunroof', impact: 'medium', category: 'exterior', baseValue: 600 },
  { id: 'led-headlights', name: 'LED Headlights', impact: 'low', category: 'exterior', baseValue: 300 },
  
  // Interior features
  { id: 'leather-seats', name: 'Leather Seats', impact: 'medium', category: 'interior', baseValue: 800 },
  { id: 'heated-seats', name: 'Heated Seats', impact: 'medium', category: 'interior', baseValue: 400 },
  
  // Climate features
  { id: 'dual-zone-ac', name: 'Dual Zone AC', impact: 'low', category: 'climate', baseValue: 200 },
  { id: 'ventilated-seats', name: 'Ventilated Seats', impact: 'medium', category: 'climate', baseValue: 500 },
  
  // Luxury features
  { id: 'premium-leather', name: 'Premium Leather', impact: 'high', category: 'luxury_materials', baseValue: 1200 },
  { id: 'wood-trim', name: 'Wood Trim', impact: 'medium', category: 'luxury_materials', baseValue: 400 },
  
  // Performance features
  { id: 'sport-package', name: 'Sport Package', impact: 'high', category: 'performance_packages', baseValue: 1500 },
  { id: 'performance-exhaust', name: 'Performance Exhaust', impact: 'medium', category: 'performance_packages', baseValue: 800 },
];

export function getFeaturesByCategory(category: string): Feature[] {
  return mockFeatures.filter(feature => feature.category === category);
}

export function calculateEnhancedFeatureValue(featureIds: string[], baseVehicleValue: number) {
  const features = mockFeatures.filter(feature => featureIds.includes(feature.id));
  const totalAdjustment = features.reduce((sum, feature) => sum + feature.baseValue, 0);
  
  return {
    totalAdjustment,
    adjustedValue: baseVehicleValue + totalAdjustment,
    features
  };
}
