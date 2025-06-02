
export interface FeatureDefinition {
  id: string;
  name: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  baseValue: number;
  multiplier: number;
}

export interface FeatureCalculationResult {
  totalAdjustment: number;
  percentageOfBase: number;
  featuresCount: number;
}

// Enhanced feature definitions organized by category
const ENHANCED_FEATURES: FeatureDefinition[] = [
  // Technology Features
  { id: 'navigation_system', name: 'GPS Navigation System', category: 'technology', impact: 'medium', baseValue: 800, multiplier: 1.0 },
  { id: 'apple_carplay', name: 'Apple CarPlay', category: 'technology', impact: 'high', baseValue: 600, multiplier: 1.2 },
  { id: 'android_auto', name: 'Android Auto', category: 'technology', impact: 'high', baseValue: 600, multiplier: 1.2 },
  { id: 'wireless_charging', name: 'Wireless Phone Charging', category: 'technology', impact: 'medium', baseValue: 400, multiplier: 1.0 },
  { id: 'heads_up_display', name: 'Head-Up Display', category: 'technology', impact: 'high', baseValue: 1200, multiplier: 1.3 },
  { id: 'digital_instrument_cluster', name: 'Digital Instrument Cluster', category: 'technology', impact: 'medium', baseValue: 800, multiplier: 1.1 },

  // Safety & Security Features
  { id: 'backup_camera', name: 'Backup Camera', category: 'safety', impact: 'high', baseValue: 500, multiplier: 1.2 },
  { id: 'blind_spot_monitoring', name: 'Blind Spot Monitoring', category: 'safety', impact: 'high', baseValue: 800, multiplier: 1.3 },
  { id: 'lane_departure_warning', name: 'Lane Departure Warning', category: 'safety', impact: 'medium', baseValue: 600, multiplier: 1.1 },
  { id: 'collision_avoidance', name: 'Collision Avoidance System', category: 'safety', impact: 'high', baseValue: 1000, multiplier: 1.4 },
  { id: 'parking_sensors', name: 'Parking Sensors', category: 'safety', impact: 'medium', baseValue: 400, multiplier: 1.0 },
  { id: 'adaptive_cruise_control', name: 'Adaptive Cruise Control', category: 'safety', impact: 'high', baseValue: 1200, multiplier: 1.3 },

  // Climate Control Features
  { id: 'dual_zone_climate', name: 'Dual Zone Climate Control', category: 'climate', impact: 'medium', baseValue: 600, multiplier: 1.1 },
  { id: 'tri_zone_climate', name: 'Tri-Zone Climate Control', category: 'climate', impact: 'high', baseValue: 900, multiplier: 1.2 },
  { id: 'heated_seats', name: 'Heated Front Seats', category: 'climate', impact: 'medium', baseValue: 500, multiplier: 1.0 },
  { id: 'cooled_seats', name: 'Ventilated/Cooled Seats', category: 'climate', impact: 'high', baseValue: 800, multiplier: 1.2 },
  { id: 'heated_steering_wheel', name: 'Heated Steering Wheel', category: 'climate', impact: 'low', baseValue: 200, multiplier: 0.8 },
  { id: 'remote_start', name: 'Remote Engine Start', category: 'climate', impact: 'medium', baseValue: 400, multiplier: 1.0 },

  // Audio & Entertainment Features
  { id: 'premium_audio', name: 'Premium Audio System', category: 'audio', impact: 'medium', baseValue: 800, multiplier: 1.1 },
  { id: 'bose_audio', name: 'Bose Audio System', category: 'audio', impact: 'high', baseValue: 1200, multiplier: 1.3 },
  { id: 'harman_kardon', name: 'Harman Kardon Audio', category: 'audio', impact: 'high', baseValue: 1100, multiplier: 1.25 },
  { id: 'satellite_radio', name: 'Satellite Radio', category: 'audio', impact: 'low', baseValue: 300, multiplier: 0.9 },
  { id: 'rear_entertainment', name: 'Rear Seat Entertainment', category: 'audio', impact: 'medium', baseValue: 1000, multiplier: 1.1 },

  // Interior Materials Features
  { id: 'leather_seats', name: 'Leather Seats', category: 'interior', impact: 'high', baseValue: 1500, multiplier: 1.3 },
  { id: 'memory_seats', name: 'Memory Seats', category: 'interior', impact: 'medium', baseValue: 600, multiplier: 1.1 },
  { id: 'power_seats', name: 'Power Adjustable Seats', category: 'interior', impact: 'medium', baseValue: 500, multiplier: 1.0 },
  { id: 'wood_trim', name: 'Wood Grain Trim', category: 'interior', impact: 'medium', baseValue: 400, multiplier: 1.0 },
  { id: 'carbon_fiber_trim', name: 'Carbon Fiber Trim', category: 'interior', impact: 'high', baseValue: 800, multiplier: 1.2 },

  // Exterior Features
  { id: 'sunroof', name: 'Sunroof/Moonroof', category: 'exterior', impact: 'high', baseValue: 1200, multiplier: 1.2 },
  { id: 'panoramic_sunroof', name: 'Panoramic Sunroof', category: 'exterior', impact: 'high', baseValue: 1800, multiplier: 1.4 },
  { id: 'led_headlights', name: 'LED Headlights', category: 'exterior', impact: 'medium', baseValue: 600, multiplier: 1.1 },
  { id: 'fog_lights', name: 'Fog Lights', category: 'exterior', impact: 'low', baseValue: 200, multiplier: 0.8 },
  { id: 'power_liftgate', name: 'Power Liftgate', category: 'exterior', impact: 'medium', baseValue: 800, multiplier: 1.1 },

  // Luxury Materials Features
  { id: 'premium_leather', name: 'Premium Leather Package', category: 'luxury_materials', impact: 'high', baseValue: 2000, multiplier: 1.4 },
  { id: 'alcantara', name: 'Alcantara Upholstery', category: 'luxury_materials', impact: 'high', baseValue: 1500, multiplier: 1.3 },
  { id: 'nappa_leather', name: 'Nappa Leather', category: 'luxury_materials', impact: 'high', baseValue: 2500, multiplier: 1.5 },
  { id: 'real_wood_trim', name: 'Real Wood Trim', category: 'luxury_materials', impact: 'medium', baseValue: 800, multiplier: 1.2 },

  // Driver Assistance Features (ADAS)
  { id: 'auto_parking', name: 'Automatic Parking Assist', category: 'adas', impact: 'high', baseValue: 1000, multiplier: 1.3 },
  { id: 'lane_keeping_assist', name: 'Lane Keeping Assist', category: 'adas', impact: 'high', baseValue: 800, multiplier: 1.2 },
  { id: 'traffic_sign_recognition', name: 'Traffic Sign Recognition', category: 'adas', impact: 'medium', baseValue: 400, multiplier: 1.0 },
  { id: 'driver_attention_monitor', name: 'Driver Attention Monitor', category: 'adas', impact: 'medium', baseValue: 500, multiplier: 1.1 },
  { id: 'night_vision', name: 'Night Vision System', category: 'adas', impact: 'high', baseValue: 2000, multiplier: 1.5 },

  // Performance Packages
  { id: 'sport_package', name: 'Sport Package', category: 'performance_packages', impact: 'high', baseValue: 2500, multiplier: 1.4 },
  { id: 'performance_exhaust', name: 'Performance Exhaust', category: 'performance_packages', impact: 'medium', baseValue: 1200, multiplier: 1.2 },
  { id: 'sport_suspension', name: 'Sport Suspension', category: 'performance_packages', impact: 'high', baseValue: 1500, multiplier: 1.3 },
  { id: 'limited_slip_diff', name: 'Limited Slip Differential', category: 'performance_packages', impact: 'high', baseValue: 1000, multiplier: 1.3 },
  { id: 'turbo_engine', name: 'Turbocharged Engine', category: 'performance_packages', impact: 'high', baseValue: 3000, multiplier: 1.5 }
];

export function getFeaturesByCategory(category: string): FeatureDefinition[] {
  return ENHANCED_FEATURES.filter(feature => feature.category === category);
}

export function getAllFeatures(): FeatureDefinition[] {
  return ENHANCED_FEATURES;
}

export function getFeatureById(id: string): FeatureDefinition | undefined {
  return ENHANCED_FEATURES.find(feature => feature.id === id);
}

export function calculateEnhancedFeatureValue(
  selectedFeatureIds: string[],
  baseVehicleValue: number = 25000
): FeatureCalculationResult {
  if (!selectedFeatureIds || selectedFeatureIds.length === 0) {
    return {
      totalAdjustment: 0,
      percentageOfBase: 0,
      featuresCount: 0
    };
  }

  let totalAdjustment = 0;
  
  selectedFeatureIds.forEach(featureId => {
    const feature = getFeatureById(featureId);
    if (feature) {
      // Calculate feature value based on base value and vehicle value
      const featureValue = feature.baseValue * feature.multiplier;
      
      // Apply a scaling factor based on vehicle value
      const scalingFactor = Math.min(baseVehicleValue / 25000, 2.0); // Cap at 2x for luxury vehicles
      const adjustedValue = featureValue * scalingFactor;
      
      totalAdjustment += Math.round(adjustedValue);
    }
  });

  // Cap total feature adjustment to prevent unrealistic values (max 25% of base value)
  const maxAdjustment = Math.round(baseVehicleValue * 0.25);
  totalAdjustment = Math.min(totalAdjustment, maxAdjustment);

  const percentageOfBase = baseVehicleValue > 0 ? (totalAdjustment / baseVehicleValue) * 100 : 0;

  return {
    totalAdjustment,
    percentageOfBase: Math.round(percentageOfBase * 100) / 100, // Round to 2 decimal places
    featuresCount: selectedFeatureIds.length
  };
}

export function getFeatureCategories(): string[] {
  return [...new Set(ENHANCED_FEATURES.map(feature => feature.category))];
}

export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    technology: 'Technology',
    safety: 'Safety & Security',
    climate: 'Climate Control',
    audio: 'Audio & Entertainment',
    interior: 'Interior Materials',
    exterior: 'Exterior Features',
    luxury_materials: 'Luxury Materials',
    adas: 'Driver Assistance',
    performance_packages: 'Performance Packages'
  };
  
  return categoryNames[category] || category;
}
