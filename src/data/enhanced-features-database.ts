
export interface EnhancedFeature {
  id: string;
  name: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  rarity: 'common' | 'uncommon' | 'rare' | 'premium' | 'luxury';
  icon?: string;
  percentage?: number;
  fixed?: number;
}

export const FEATURE_CATEGORIES = [
  'Technology',
  'Safety & Security', 
  'Climate Control',
  'Audio & Entertainment',
  'Interior Materials',
  'Exterior Features',
  'Performance Packages',
  'Driver Assistance',
  'Luxury Materials',
  'Service & Maintenance',
  'Tires & Brakes',
  'Vehicle Basics'
];

export const ENHANCED_FEATURES: Record<string, EnhancedFeature[]> = {
  'Technology': [
    {
      id: 'navigation_system',
      name: 'Navigation System',
      category: 'Technology',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.02,
      fixed: 0
    },
    {
      id: 'bluetooth_connectivity',
      name: 'Bluetooth Connectivity',
      category: 'Technology',
      impact: 'low',
      rarity: 'common',
      percentage: 0.01,
      fixed: 0
    },
    {
      id: 'wireless_charging',
      name: 'Wireless Charging',
      category: 'Technology',
      impact: 'medium',
      rarity: 'uncommon',
      percentage: 0.015,
      fixed: 0
    },
    {
      id: 'apple_carplay',
      name: 'Apple CarPlay',
      category: 'Technology',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.015,
      fixed: 0
    }
  ],
  'Safety & Security': [
    {
      id: 'backup_camera',
      name: 'Backup Camera',
      category: 'Safety & Security',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.02,
      fixed: 0
    },
    {
      id: 'blind_spot_monitoring',
      name: 'Blind Spot Monitoring',
      category: 'Safety & Security',
      impact: 'high',
      rarity: 'uncommon',
      percentage: 0.025,
      fixed: 0
    },
    {
      id: 'lane_departure_warning',
      name: 'Lane Departure Warning',
      category: 'Safety & Security',
      impact: 'high',
      rarity: 'uncommon',
      percentage: 0.02,
      fixed: 0
    },
    {
      id: 'adaptive_cruise_control',
      name: 'Adaptive Cruise Control',
      category: 'Safety & Security',
      impact: 'high',
      rarity: 'rare',
      percentage: 0.03,
      fixed: 0
    }
  ],
  'Climate Control': [
    {
      id: 'dual_zone_climate',
      name: 'Dual Zone Climate Control',
      category: 'Climate Control',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.015,
      fixed: 0
    },
    {
      id: 'heated_seats',
      name: 'Heated Seats',
      category: 'Climate Control',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.02,
      fixed: 0
    },
    {
      id: 'ventilated_seats',
      name: 'Ventilated Seats',
      category: 'Climate Control',
      impact: 'high',
      rarity: 'uncommon',
      percentage: 0.025,
      fixed: 0
    },
    {
      id: 'heated_steering_wheel',
      name: 'Heated Steering Wheel',
      category: 'Climate Control',
      impact: 'low',
      rarity: 'uncommon',
      percentage: 0.01,
      fixed: 0
    }
  ],
  'Audio & Entertainment': [
    {
      id: 'premium_sound_system',
      name: 'Premium Sound System',
      category: 'Audio & Entertainment',
      impact: 'medium',
      rarity: 'uncommon',
      percentage: 0.02,
      fixed: 0
    },
    {
      id: 'satellite_radio',
      name: 'Satellite Radio',
      category: 'Audio & Entertainment',
      impact: 'low',
      rarity: 'common',
      percentage: 0.01,
      fixed: 0
    },
    {
      id: 'rear_entertainment',
      name: 'Rear Entertainment System',
      category: 'Audio & Entertainment',
      impact: 'medium',
      rarity: 'rare',
      percentage: 0.025,
      fixed: 0
    }
  ],
  'Interior Materials': [
    {
      id: 'leather_seats',
      name: 'Leather Seats',
      category: 'Interior Materials',
      impact: 'high',
      rarity: 'uncommon',
      percentage: 0.03,
      fixed: 0
    },
    {
      id: 'wood_trim',
      name: 'Wood Trim',
      category: 'Interior Materials',
      impact: 'medium',
      rarity: 'uncommon',
      percentage: 0.015,
      fixed: 0
    },
    {
      id: 'alcantara_interior',
      name: 'Alcantara Interior',
      category: 'Interior Materials',
      impact: 'high',
      rarity: 'luxury',
      percentage: 0.04,
      fixed: 0
    }
  ],
  'Exterior Features': [
    {
      id: 'sunroof',
      name: 'Sunroof/Moonroof',
      category: 'Exterior Features',
      impact: 'high',
      rarity: 'common',
      percentage: 0.025,
      fixed: 0
    },
    {
      id: 'alloy_wheels',
      name: 'Alloy Wheels',
      category: 'Exterior Features',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.015,
      fixed: 0
    },
    {
      id: 'led_headlights',
      name: 'LED Headlights',
      category: 'Exterior Features',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.02,
      fixed: 0
    }
  ],
  'Performance Packages': [
    {
      id: 'sport_package',
      name: 'Sport Package',
      category: 'Performance Packages',
      impact: 'high',
      rarity: 'uncommon',
      percentage: 0.035,
      fixed: 0
    },
    {
      id: 'performance_tires',
      name: 'Performance Tires',
      category: 'Performance Packages',
      impact: 'medium',
      rarity: 'uncommon',
      percentage: 0.02,
      fixed: 0
    },
    {
      id: 'turbo_engine',
      name: 'Turbocharged Engine',
      category: 'Performance Packages',
      impact: 'high',
      rarity: 'rare',
      percentage: 0.04,
      fixed: 0
    }
  ],
  'Driver Assistance': [
    {
      id: 'parking_sensors',
      name: 'Parking Sensors',
      category: 'Driver Assistance',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.015,
      fixed: 0
    },
    {
      id: 'auto_parking',
      name: 'Automatic Parking',
      category: 'Driver Assistance',
      impact: 'high',
      rarity: 'rare',
      percentage: 0.03,
      fixed: 0
    }
  ],
  'Luxury Materials': [
    {
      id: 'carbon_fiber',
      name: 'Carbon Fiber Trim',
      category: 'Luxury Materials',
      impact: 'high',
      rarity: 'luxury',
      percentage: 0.035,
      fixed: 0
    },
    {
      id: 'premium_leather',
      name: 'Premium Leather Package',
      category: 'Luxury Materials',
      impact: 'high',
      rarity: 'premium',
      percentage: 0.04,
      fixed: 0
    }
  ],
  'Service & Maintenance': [
    {
      id: 'maintenance_package',
      name: 'Prepaid Maintenance',
      category: 'Service & Maintenance',
      impact: 'medium',
      rarity: 'uncommon',
      percentage: 0.02,
      fixed: 0
    }
  ],
  'Tires & Brakes': [
    {
      id: 'performance_brakes',
      name: 'Performance Brake Package',
      category: 'Tires & Brakes',
      impact: 'high',
      rarity: 'rare',
      percentage: 0.03,
      fixed: 0
    }
  ],
  'Vehicle Basics': [
    {
      id: 'keyless_entry',
      name: 'Keyless Entry',
      category: 'Vehicle Basics',
      impact: 'low',
      rarity: 'common',
      percentage: 0.01,
      fixed: 0
    },
    {
      id: 'remote_start',
      name: 'Remote Start',
      category: 'Vehicle Basics',
      impact: 'medium',
      rarity: 'common',
      percentage: 0.015,
      fixed: 0
    }
  ]
};
