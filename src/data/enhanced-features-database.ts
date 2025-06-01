
export interface EnhancedFeature {
  id: string;
  name: string;
  category: string;
  description: string;
  percentValue: number;  // Percentage of base value
  fixedValue: number;    // Fixed dollar amount
  rarity: 'common' | 'premium' | 'luxury';
  impact: 'low' | 'medium' | 'high';
}

export interface FeatureCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'comfort',
    name: 'Comfort & Convenience',
    icon: '🪑',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    description: 'Interior comfort and convenience features'
  },
  {
    id: 'technology',
    name: 'Technology & Infotainment',
    icon: '📱',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    description: 'Advanced technology and entertainment systems'
  },
  {
    id: 'safety',
    name: 'Safety & Driver Assistance',
    icon: '🛡️',
    color: 'bg-green-50 border-green-200 text-green-800',
    description: 'Safety systems and driver assistance features'
  },
  {
    id: 'performance',
    name: 'Performance & Drivetrain',
    icon: '⚡',
    color: 'bg-red-50 border-red-200 text-red-800',
    description: 'Engine and performance enhancements'
  },
  {
    id: 'exterior',
    name: 'Exterior & Styling',
    icon: '✨',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    description: 'Exterior styling and appearance features'
  },
  {
    id: 'luxury',
    name: 'Luxury & Premium',
    icon: '💎',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    description: 'High-end luxury and premium features'
  }
];

export const ENHANCED_FEATURES: EnhancedFeature[] = [
  // Comfort & Convenience
  {
    id: 'leather_seats',
    name: 'Leather Seats',
    category: 'comfort',
    description: 'Premium leather upholstery throughout',
    percentValue: 0.015,
    fixedValue: 800,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'heated_seats',
    name: 'Heated Front Seats',
    category: 'comfort',
    description: 'Heated driver and passenger seats',
    percentValue: 0.008,
    fixedValue: 400,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: 'ventilated_seats',
    name: 'Ventilated/Cooled Seats',
    category: 'comfort',
    description: 'Air-conditioned front seats',
    percentValue: 0.012,
    fixedValue: 600,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'memory_seats',
    name: 'Memory Seats',
    category: 'comfort',
    description: 'Power seats with memory settings',
    percentValue: 0.010,
    fixedValue: 500,
    rarity: 'premium',
    impact: 'medium'
  },
  {
    id: 'massage_seats',
    name: 'Massage Seats',
    category: 'luxury',
    description: 'Multi-contour seats with massage function',
    percentValue: 0.025,
    fixedValue: 1200,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'heated_steering_wheel',
    name: 'Heated Steering Wheel',
    category: 'comfort',
    description: 'Heated steering wheel for cold weather',
    percentValue: 0.005,
    fixedValue: 200,
    rarity: 'common',
    impact: 'low'
  },
  {
    id: 'power_liftgate',
    name: 'Power Liftgate',
    category: 'comfort',
    description: 'Hands-free power rear liftgate',
    percentValue: 0.008,
    fixedValue: 400,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: 'remote_start',
    name: 'Remote Start',
    category: 'comfort',
    description: 'Remote engine start capability',
    percentValue: 0.006,
    fixedValue: 300,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: 'keyless_entry',
    name: 'Keyless Entry & Start',
    category: 'comfort',
    description: 'Push-button start with proximity key',
    percentValue: 0.007,
    fixedValue: 350,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: 'dual_zone_climate',
    name: 'Dual-Zone Climate Control',
    category: 'comfort',
    description: 'Separate climate controls for driver and passenger',
    percentValue: 0.006,
    fixedValue: 300,
    rarity: 'common',
    impact: 'medium'
  },

  // Technology & Infotainment
  {
    id: 'navigation_system',
    name: 'Built-in Navigation',
    category: 'technology',
    description: 'Factory GPS navigation system',
    percentValue: 0.012,
    fixedValue: 600,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'premium_audio',
    name: 'Premium Audio System',
    category: 'technology',
    description: 'High-end branded audio system (Bose, Harman Kardon, etc.)',
    percentValue: 0.018,
    fixedValue: 900,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'apple_carplay',
    name: 'Apple CarPlay/Android Auto',
    category: 'technology',
    description: 'Smartphone integration system',
    percentValue: 0.008,
    fixedValue: 400,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: 'wireless_charging',
    name: 'Wireless Phone Charging',
    category: 'technology',
    description: 'Qi wireless charging pad',
    percentValue: 0.005,
    fixedValue: 250,
    rarity: 'premium',
    impact: 'low'
  },
  {
    id: 'heads_up_display',
    name: 'Head-Up Display',
    category: 'technology',
    description: 'Windshield-projected information display',
    percentValue: 0.015,
    fixedValue: 750,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'wifi_hotspot',
    name: 'Wi-Fi Hotspot',
    category: 'technology',
    description: 'Built-in wireless internet connectivity',
    percentValue: 0.006,
    fixedValue: 300,
    rarity: 'premium',
    impact: 'medium'
  },
  {
    id: 'digital_dashboard',
    name: 'Digital Instrument Cluster',
    category: 'technology',
    description: 'Fully digital gauge cluster',
    percentValue: 0.020,
    fixedValue: 1000,
    rarity: 'luxury',
    impact: 'high'
  },

  // Safety & Driver Assistance
  {
    id: 'backup_camera',
    name: 'Backup Camera',
    category: 'safety',
    description: 'Rear-view camera system',
    percentValue: 0.005,
    fixedValue: 250,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: '360_camera',
    name: '360-Degree Camera System',
    category: 'safety',
    description: 'Surround-view camera system',
    percentValue: 0.018,
    fixedValue: 900,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'blind_spot_monitoring',
    name: 'Blind Spot Monitoring',
    category: 'safety',
    description: 'Blind spot detection with warning alerts',
    percentValue: 0.010,
    fixedValue: 500,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'lane_keep_assist',
    name: 'Lane Keep Assist',
    category: 'safety',
    description: 'Active lane keeping assistance',
    percentValue: 0.012,
    fixedValue: 600,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'adaptive_cruise',
    name: 'Adaptive Cruise Control',
    category: 'safety',
    description: 'Intelligent cruise control with distance management',
    percentValue: 0.015,
    fixedValue: 750,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'automatic_emergency_braking',
    name: 'Automatic Emergency Braking',
    category: 'safety',
    description: 'Collision prevention with automatic braking',
    percentValue: 0.013,
    fixedValue: 650,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'parking_sensors',
    name: 'Parking Sensors',
    category: 'safety',
    description: 'Front and rear parking sensors',
    percentValue: 0.007,
    fixedValue: 350,
    rarity: 'common',
    impact: 'medium'
  },
  {
    id: 'cross_traffic_alert',
    name: 'Cross Traffic Alert',
    category: 'safety',
    description: 'Rear cross-traffic detection system',
    percentValue: 0.008,
    fixedValue: 400,
    rarity: 'premium',
    impact: 'medium'
  },

  // Performance & Drivetrain
  {
    id: 'all_wheel_drive',
    name: 'All-Wheel Drive',
    category: 'performance',
    description: 'AWD system for enhanced traction',
    percentValue: 0.025,
    fixedValue: 1500,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'sport_suspension',
    name: 'Sport Suspension',
    category: 'performance',
    description: 'Performance-tuned suspension system',
    percentValue: 0.015,
    fixedValue: 800,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'turbo_engine',
    name: 'Turbocharged Engine',
    category: 'performance',
    description: 'Forced induction engine system',
    percentValue: 0.020,
    fixedValue: 1200,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'performance_exhaust',
    name: 'Performance Exhaust',
    category: 'performance',
    description: 'Sport exhaust system',
    percentValue: 0.008,
    fixedValue: 400,
    rarity: 'premium',
    impact: 'medium'
  },
  {
    id: 'limited_slip_diff',
    name: 'Limited Slip Differential',
    category: 'performance',
    description: 'Performance differential for better traction',
    percentValue: 0.012,
    fixedValue: 600,
    rarity: 'premium',
    impact: 'medium'
  },
  {
    id: 'launch_control',
    name: 'Launch Control',
    category: 'performance',
    description: 'Optimized acceleration system',
    percentValue: 0.010,
    fixedValue: 500,
    rarity: 'luxury',
    impact: 'medium'
  },

  // Exterior & Styling
  {
    id: 'sunroof',
    name: 'Sunroof/Moonroof',
    category: 'exterior',
    description: 'Power sunroof with tilt and slide',
    percentValue: 0.018,
    fixedValue: 900,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'panoramic_roof',
    name: 'Panoramic Roof',
    category: 'exterior',
    description: 'Large panoramic glass roof',
    percentValue: 0.025,
    fixedValue: 1300,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'premium_wheels',
    name: 'Premium Alloy Wheels',
    category: 'exterior',
    description: 'Upgraded alloy wheel package',
    percentValue: 0.012,
    fixedValue: 600,
    rarity: 'premium',
    impact: 'medium'
  },
  {
    id: 'led_headlights',
    name: 'LED Headlights',
    category: 'exterior',
    description: 'Full LED headlight system',
    percentValue: 0.010,
    fixedValue: 500,
    rarity: 'premium',
    impact: 'medium'
  },
  {
    id: 'adaptive_headlights',
    name: 'Adaptive Headlights',
    category: 'exterior',
    description: 'Steering-responsive headlight system',
    percentValue: 0.015,
    fixedValue: 750,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'running_boards',
    name: 'Running Boards/Side Steps',
    category: 'exterior',
    description: 'Side step assistance boards',
    percentValue: 0.005,
    fixedValue: 250,
    rarity: 'common',
    impact: 'low'
  },
  {
    id: 'roof_rails',
    name: 'Roof Rails',
    category: 'exterior',
    description: 'Roof-mounted cargo rail system',
    percentValue: 0.004,
    fixedValue: 200,
    rarity: 'common',
    impact: 'low'
  },
  {
    id: 'towing_package',
    name: 'Towing Package',
    category: 'exterior',
    description: 'Factory towing preparation package',
    percentValue: 0.015,
    fixedValue: 800,
    rarity: 'premium',
    impact: 'high'
  },

  // Luxury & Premium
  {
    id: 'third_row_seating',
    name: 'Third Row Seating',
    category: 'luxury',
    description: 'Additional seating capacity',
    percentValue: 0.020,
    fixedValue: 1000,
    rarity: 'premium',
    impact: 'high'
  },
  {
    id: 'captain_chairs',
    name: 'Captain\'s Chairs',
    category: 'luxury',
    description: 'Individual second-row captain\'s chairs',
    percentValue: 0.015,
    fixedValue: 750,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'premium_interior',
    name: 'Premium Interior Package',
    category: 'luxury',
    description: 'Upgraded interior materials and trim',
    percentValue: 0.022,
    fixedValue: 1100,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'air_suspension',
    name: 'Air Suspension',
    category: 'luxury',
    description: 'Adaptive air suspension system',
    percentValue: 0.030,
    fixedValue: 1800,
    rarity: 'luxury',
    impact: 'high'
  },
  {
    id: 'rear_entertainment',
    name: 'Rear Entertainment System',
    category: 'luxury',
    description: 'Rear seat entertainment displays',
    percentValue: 0.018,
    fixedValue: 900,
    rarity: 'luxury',
    impact: 'high'
  }
];

export const MAX_FEATURE_ADJUSTMENT = 0.15; // 15% maximum total adjustment
