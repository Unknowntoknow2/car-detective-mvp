
export interface EnhancedFeature {
  name: string;
  impact: 'low' | 'medium' | 'high';
  rarity: 'common' | 'uncommon' | 'rare';
  percentage?: number; // percentage of base value
  fixed?: number; // fixed dollar amount
}

export const FEATURE_CATEGORIES = [
  'Technology',
  'Safety & Security',
  'Climate Control',
  'Audio & Entertainment',
  'Interior Materials',
  'Exterior Features',
  'Luxury Materials',
  'Driver Assistance',
  'Performance Packages',
  'Comfort Features',
  'Convenience Features',
  'Sport Features'
];

export const ENHANCED_FEATURES: Record<string, EnhancedFeature[]> = {
  'Technology': [
    { name: 'Navigation System', impact: 'medium', rarity: 'common', percentage: 0.015 },
    { name: 'Backup Camera', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Bluetooth Connectivity', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'Wireless Charging', impact: 'medium', rarity: 'uncommon', percentage: 0.01 },
    { name: 'Head-Up Display', impact: 'high', rarity: 'rare', percentage: 0.025 },
    { name: 'Digital Instrument Cluster', impact: 'medium', rarity: 'uncommon', percentage: 0.015 }
  ],
  'Safety & Security': [
    { name: 'Anti-lock Brakes (ABS)', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Electronic Stability Control', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Airbags (Multiple)', impact: 'high', rarity: 'common', percentage: 0.02 },
    { name: 'Security System', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'Blind Spot Monitoring', impact: 'high', rarity: 'uncommon', percentage: 0.02 },
    { name: 'Lane Departure Warning', impact: 'high', rarity: 'uncommon', percentage: 0.015 }
  ],
  'Climate Control': [
    { name: 'Air Conditioning', impact: 'medium', rarity: 'common', percentage: 0.015 },
    { name: 'Heated Seats', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Cooled Seats', impact: 'high', rarity: 'uncommon', percentage: 0.02 },
    { name: 'Dual Zone Climate', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Heated Steering Wheel', impact: 'low', rarity: 'uncommon', percentage: 0.005 },
    { name: 'Remote Start', impact: 'medium', rarity: 'common', percentage: 0.01 }
  ],
  'Audio & Entertainment': [
    { name: 'Premium Audio System', impact: 'medium', rarity: 'common', percentage: 0.015 },
    { name: 'Satellite Radio', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'CD Player', impact: 'low', rarity: 'common', percentage: 0.003 },
    { name: 'Premium Sound Package', impact: 'high', rarity: 'uncommon', percentage: 0.025 },
    { name: 'Rear Entertainment System', impact: 'high', rarity: 'rare', percentage: 0.03 },
    { name: 'Apple CarPlay/Android Auto', impact: 'medium', rarity: 'common', percentage: 0.01 }
  ],
  'Interior Materials': [
    { name: 'Leather Seats', impact: 'high', rarity: 'common', percentage: 0.03 },
    { name: 'Premium Interior Trim', impact: 'medium', rarity: 'uncommon', percentage: 0.015 },
    { name: 'Wood Grain Accents', impact: 'medium', rarity: 'uncommon', percentage: 0.01 },
    { name: 'Carbon Fiber Trim', impact: 'high', rarity: 'rare', percentage: 0.025 },
    { name: 'Alcantara Upholstery', impact: 'high', rarity: 'rare', percentage: 0.03 },
    { name: 'Memory Seats', impact: 'medium', rarity: 'uncommon', percentage: 0.015 }
  ],
  'Exterior Features': [
    { name: 'Alloy Wheels', impact: 'medium', rarity: 'common', percentage: 0.015 },
    { name: 'Sunroof/Moonroof', impact: 'high', rarity: 'common', percentage: 0.025 },
    { name: 'Fog Lights', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'LED Headlights', impact: 'medium', rarity: 'uncommon', percentage: 0.015 },
    { name: 'Power Liftgate', impact: 'medium', rarity: 'uncommon', percentage: 0.015 },
    { name: 'Running Boards', impact: 'low', rarity: 'common', percentage: 0.005 }
  ],
  'Luxury Materials': [
    { name: 'Quilted Leather', impact: 'high', rarity: 'rare', percentage: 0.04 },
    { name: 'Massage Seats', impact: 'high', rarity: 'rare', percentage: 0.035 },
    { name: 'Ventilated Seats', impact: 'high', rarity: 'uncommon', percentage: 0.025 },
    { name: 'Premium Leather Package', impact: 'high', rarity: 'uncommon', percentage: 0.03 },
    { name: 'Luxury Interior Package', impact: 'high', rarity: 'rare', percentage: 0.05 },
    { name: 'Executive Seating', impact: 'high', rarity: 'rare', percentage: 0.045 }
  ],
  'Driver Assistance': [
    { name: 'Adaptive Cruise Control', impact: 'high', rarity: 'uncommon', percentage: 0.025 },
    { name: 'Parking Sensors', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Lane Keep Assist', impact: 'high', rarity: 'uncommon', percentage: 0.02 },
    { name: 'Automatic Emergency Braking', impact: 'high', rarity: 'uncommon', percentage: 0.02 },
    { name: '360-Degree Camera', impact: 'high', rarity: 'rare', percentage: 0.03 },
    { name: 'Traffic Sign Recognition', impact: 'medium', rarity: 'uncommon', percentage: 0.015 }
  ],
  'Performance Packages': [
    { name: 'Sport Package', impact: 'high', rarity: 'uncommon', percentage: 0.035 },
    { name: 'Performance Suspension', impact: 'high', rarity: 'uncommon', percentage: 0.025 },
    { name: 'Sport Exhaust', impact: 'medium', rarity: 'uncommon', percentage: 0.015 },
    { name: 'Performance Tires', impact: 'medium', rarity: 'uncommon', percentage: 0.01 },
    { name: 'Limited Slip Differential', impact: 'high', rarity: 'rare', percentage: 0.03 },
    { name: 'Track Package', impact: 'high', rarity: 'rare', percentage: 0.05 }
  ],
  'Comfort Features': [
    { name: 'Power Seats', impact: 'medium', rarity: 'common', percentage: 0.015 },
    { name: 'Lumbar Support', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'Adjustable Pedals', impact: 'low', rarity: 'uncommon', percentage: 0.005 },
    { name: 'Tilt Steering', impact: 'low', rarity: 'common', percentage: 0.003 },
    { name: 'Telescoping Steering', impact: 'low', rarity: 'common', percentage: 0.003 },
    { name: 'Multi-Contour Seats', impact: 'high', rarity: 'rare', percentage: 0.025 }
  ],
  'Convenience Features': [
    { name: 'Keyless Entry', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Push Button Start', impact: 'medium', rarity: 'common', percentage: 0.01 },
    { name: 'Auto Dimming Mirror', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'Rain Sensing Wipers', impact: 'low', rarity: 'uncommon', percentage: 0.005 },
    { name: 'Auto Headlights', impact: 'low', rarity: 'common', percentage: 0.005 },
    { name: 'Proximity Key', impact: 'medium', rarity: 'common', percentage: 0.01 }
  ],
  'Sport Features': [
    { name: 'Sport Seats', impact: 'medium', rarity: 'uncommon', percentage: 0.02 },
    { name: 'Sport Steering Wheel', impact: 'low', rarity: 'uncommon', percentage: 0.01 },
    { name: 'Paddle Shifters', impact: 'medium', rarity: 'uncommon', percentage: 0.015 },
    { name: 'Sport Mode', impact: 'medium', rarity: 'uncommon', percentage: 0.015 },
    { name: 'Launch Control', impact: 'high', rarity: 'rare', percentage: 0.025 },
    { name: 'Track Mode', impact: 'high', rarity: 'rare', percentage: 0.03 }
  ]
};
