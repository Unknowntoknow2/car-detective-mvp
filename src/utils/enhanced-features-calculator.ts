
interface FeatureDefinition {
  id: string;
  name: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  baseValue: number;
  description?: string;
}

// Comprehensive feature definitions for all categories
const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  // Technology Features
  { id: 'tech_navigation', name: 'GPS Navigation System', category: 'technology', impact: 'medium', baseValue: 800 },
  { id: 'tech_bluetooth', name: 'Bluetooth Connectivity', category: 'technology', impact: 'low', baseValue: 300 },
  { id: 'tech_smartphone', name: 'Apple CarPlay/Android Auto', category: 'technology', impact: 'medium', baseValue: 600 },
  { id: 'tech_wireless_charging', name: 'Wireless Phone Charging', category: 'technology', impact: 'low', baseValue: 400 },
  { id: 'tech_wifi', name: 'Built-in WiFi Hotspot', category: 'technology', impact: 'medium', baseValue: 500 },
  { id: 'tech_heads_up', name: 'Head-Up Display', category: 'technology', impact: 'high', baseValue: 1200 },

  // Safety & Security Features
  { id: 'safety_alarm', name: 'Security Alarm System', category: 'safety', impact: 'low', baseValue: 300 },
  { id: 'safety_remote_start', name: 'Remote Engine Start', category: 'safety', impact: 'medium', baseValue: 500 },
  { id: 'safety_keyless', name: 'Keyless Entry/Start', category: 'safety', impact: 'medium', baseValue: 600 },
  { id: 'safety_backup_camera', name: 'Backup Camera', category: 'safety', impact: 'medium', baseValue: 400 },
  { id: 'safety_parking_sensors', name: 'Parking Sensors', category: 'safety', impact: 'low', baseValue: 350 },
  { id: 'safety_blind_spot', name: 'Blind Spot Monitoring', category: 'safety', impact: 'high', baseValue: 800 },

  // Climate Control Features
  { id: 'climate_auto', name: 'Automatic Climate Control', category: 'climate', impact: 'medium', baseValue: 400 },
  { id: 'climate_dual_zone', name: 'Dual Zone Climate', category: 'climate', impact: 'medium', baseValue: 600 },
  { id: 'climate_tri_zone', name: 'Tri-Zone Climate Control', category: 'climate', impact: 'high', baseValue: 900 },
  { id: 'climate_heated_seats', name: 'Heated Front Seats', category: 'climate', impact: 'medium', baseValue: 500 },
  { id: 'climate_cooled_seats', name: 'Cooled/Ventilated Seats', category: 'climate', impact: 'high', baseValue: 800 },
  { id: 'climate_heated_steering', name: 'Heated Steering Wheel', category: 'climate', impact: 'low', baseValue: 300 },

  // Audio & Entertainment Features
  { id: 'audio_premium', name: 'Premium Audio System', category: 'audio', impact: 'medium', baseValue: 700 },
  { id: 'audio_bose', name: 'Bose Audio System', category: 'audio', impact: 'high', baseValue: 1200 },
  { id: 'audio_harman_kardon', name: 'Harman Kardon Audio', category: 'audio', impact: 'high', baseValue: 1100 },
  { id: 'audio_satellite', name: 'Satellite Radio', category: 'audio', impact: 'low', baseValue: 200 },
  { id: 'audio_rear_entertainment', name: 'Rear Entertainment System', category: 'audio', impact: 'medium', baseValue: 800 },
  { id: 'audio_subwoofer', name: 'Premium Subwoofer', category: 'audio', impact: 'low', baseValue: 400 },

  // Interior Materials Features
  { id: 'interior_leather', name: 'Leather Seating', category: 'interior', impact: 'high', baseValue: 1500 },
  { id: 'interior_heated_leather', name: 'Heated Leather Seats', category: 'interior', impact: 'high', baseValue: 2000 },
  { id: 'interior_memory_seats', name: 'Memory Seats', category: 'interior', impact: 'medium', baseValue: 600 },
  { id: 'interior_power_seats', name: 'Power Adjustable Seats', category: 'interior', impact: 'medium', baseValue: 500 },
  { id: 'interior_alcantara', name: 'Alcantara Trim', category: 'interior', impact: 'high', baseValue: 800 },
  { id: 'interior_carbon_fiber', name: 'Carbon Fiber Interior', category: 'interior', impact: 'high', baseValue: 1200 },

  // Exterior Features
  { id: 'exterior_sunroof', name: 'Sunroof/Moonroof', category: 'exterior', impact: 'high', baseValue: 1000 },
  { id: 'exterior_panoramic', name: 'Panoramic Sunroof', category: 'exterior', impact: 'high', baseValue: 1500 },
  { id: 'exterior_alloy_wheels', name: 'Alloy Wheels', category: 'exterior', impact: 'medium', baseValue: 600 },
  { id: 'exterior_premium_wheels', name: 'Premium Alloy Wheels', category: 'exterior', impact: 'medium', baseValue: 900 },
  { id: 'exterior_led_headlights', name: 'LED Headlights', category: 'exterior', impact: 'medium', baseValue: 500 },
  { id: 'exterior_fog_lights', name: 'Fog Lights', category: 'exterior', impact: 'low', baseValue: 200 },

  // Luxury Materials Features
  { id: 'luxury_wood_trim', name: 'Wood Grain Trim', category: 'luxury_materials', impact: 'medium', baseValue: 600 },
  { id: 'luxury_piano_black', name: 'Piano Black Trim', category: 'luxury_materials', impact: 'low', baseValue: 300 },
  { id: 'luxury_metal_trim', name: 'Brushed Metal Trim', category: 'luxury_materials', impact: 'low', baseValue: 400 },
  { id: 'luxury_ambient_lighting', name: 'Ambient Interior Lighting', category: 'luxury_materials', impact: 'medium', baseValue: 500 },
  { id: 'luxury_premium_carpet', name: 'Premium Carpet/Mats', category: 'luxury_materials', impact: 'low', baseValue: 200 },
  { id: 'luxury_soft_touch', name: 'Soft-Touch Materials', category: 'luxury_materials', impact: 'medium', baseValue: 400 },

  // Driver Assistance Features
  { id: 'adas_cruise_control', name: 'Adaptive Cruise Control', category: 'adas', impact: 'high', baseValue: 1000 },
  { id: 'adas_lane_keeping', name: 'Lane Keeping Assist', category: 'adas', impact: 'high', baseValue: 800 },
  { id: 'adas_emergency_braking', name: 'Emergency Braking', category: 'adas', impact: 'high', baseValue: 900 },
  { id: 'adas_lane_departure', name: 'Lane Departure Warning', category: 'adas', impact: 'medium', baseValue: 400 },
  { id: 'adas_traffic_sign', name: 'Traffic Sign Recognition', category: 'adas', impact: 'medium', baseValue: 300 },
  { id: 'adas_driver_attention', name: 'Driver Attention Monitor', category: 'adas', impact: 'medium', baseValue: 350 },

  // Performance Packages Features
  { id: 'perf_sport_package', name: 'Sport Package', category: 'performance_packages', impact: 'high', baseValue: 2500 },
  { id: 'perf_performance_tires', name: 'Performance Tires', category: 'performance_packages', impact: 'medium', baseValue: 800 },
  { id: 'perf_sport_suspension', name: 'Sport Suspension', category: 'performance_packages', impact: 'high', baseValue: 1200 },
  { id: 'perf_limited_slip', name: 'Limited Slip Differential', category: 'performance_packages', impact: 'high', baseValue: 1000 },
  { id: 'perf_performance_brakes', name: 'Performance Brakes', category: 'performance_packages', impact: 'medium', baseValue: 900 },
  { id: 'perf_exhaust_system', name: 'Performance Exhaust', category: 'performance_packages', impact: 'medium', baseValue: 700 }
];

export function getFeaturesByCategory(category: string): FeatureDefinition[] {
  return FEATURE_DEFINITIONS.filter(feature => feature.category === category);
}

export function getFeatureById(id: string): FeatureDefinition | undefined {
  return FEATURE_DEFINITIONS.find(feature => feature.id === id);
}

export function calculateEnhancedFeatureValue(featureIds: string[], baseVehicleValue: number = 25000) {
  let totalAdjustment = 0;
  const adjustments: Array<{ feature: string; value: number }> = [];

  featureIds.forEach(id => {
    const feature = getFeatureById(id);
    if (feature) {
      // Calculate percentage-based adjustment with diminishing returns
      const baseAdjustment = feature.baseValue;
      const percentageAdjustment = (baseAdjustment / baseVehicleValue) * 100;
      
      // Apply diminishing returns for multiple features
      const diminishingFactor = Math.max(0.5, 1 - (featureIds.length * 0.05));
      const finalAdjustment = Math.round(baseAdjustment * diminishingFactor);
      
      totalAdjustment += finalAdjustment;
      adjustments.push({ feature: feature.name, value: finalAdjustment });
    }
  });

  return {
    totalAdjustment,
    adjustments,
    featureCount: featureIds.length
  };
}

export function getAllFeatures(): FeatureDefinition[] {
  return FEATURE_DEFINITIONS;
}

export function getFeatureCategories(): string[] {
  return [...new Set(FEATURE_DEFINITIONS.map(feature => feature.category))];
}
