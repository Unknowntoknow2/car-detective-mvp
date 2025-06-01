
export interface EnhancedFeature {
  id: string;
  name: string;
  category: string;
  percentValue: number; // 0.01 = 1%
  fixedValue: number;
  impact: 'low' | 'medium' | 'high';
  rarity: 'common' | 'premium' | 'luxury';
}

export const MAX_FEATURE_ADJUSTMENT = 0.25; // 25% maximum total adjustment

export const FEATURE_CATEGORIES = [
  { id: 'safety', name: 'Safety & Security', icon: '🛡️' },
  { id: 'technology', name: 'Technology', icon: '📱' },
  { id: 'comfort', name: 'Comfort & Convenience', icon: '🛋️' },
  { id: 'performance', name: 'Performance', icon: '🏁' },
  { id: 'interior', name: 'Interior Materials', icon: '🪑' },
  { id: 'exterior', name: 'Exterior Features', icon: '✨' },
  { id: 'audio', name: 'Audio & Entertainment', icon: '🎵' },
  { id: 'lighting', name: 'Lighting Systems', icon: '💡' },
  { id: 'climate', name: 'Climate Control', icon: '🌡️' },
  { id: 'adas', name: 'Driver Assistance', icon: '🤖' },
  { id: 'luxury', name: 'Luxury Materials', icon: '💎' },
  { id: 'packages', name: 'Performance Packages', icon: '🚀' }
];

export const ENHANCED_FEATURES: EnhancedFeature[] = [
  // Safety & Security (19 features)
  { id: 'abs', name: 'Anti-lock Braking System (ABS)', category: 'safety', percentValue: 0.015, fixedValue: 300, impact: 'medium', rarity: 'common' },
  { id: 'stability_control', name: 'Electronic Stability Control', category: 'safety', percentValue: 0.018, fixedValue: 400, impact: 'medium', rarity: 'common' },
  { id: 'traction_control', name: 'Traction Control System', category: 'safety', percentValue: 0.012, fixedValue: 250, impact: 'low', rarity: 'common' },
  { id: 'front_airbags', name: 'Front Airbags', category: 'safety', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'common' },
  { id: 'side_airbags', name: 'Side Impact Airbags', category: 'safety', percentValue: 0.015, fixedValue: 400, impact: 'medium', rarity: 'common' },
  { id: 'curtain_airbags', name: 'Curtain Airbags', category: 'safety', percentValue: 0.018, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'knee_airbags', name: 'Knee Airbags', category: 'safety', percentValue: 0.012, fixedValue: 350, impact: 'low', rarity: 'premium' },
  { id: 'backup_camera', name: 'Backup Camera', category: 'safety', percentValue: 0.025, fixedValue: 800, impact: 'medium', rarity: 'common' },
  { id: '360_camera', name: '360-Degree Camera System', category: 'safety', percentValue: 0.045, fixedValue: 1500, impact: 'high', rarity: 'premium' },
  { id: 'parking_sensors', name: 'Parking Sensors', category: 'safety', percentValue: 0.02, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'blind_spot_monitor', name: 'Blind Spot Monitoring', category: 'safety', percentValue: 0.035, fixedValue: 1200, impact: 'high', rarity: 'premium' },
  { id: 'rear_cross_traffic', name: 'Rear Cross Traffic Alert', category: 'safety', percentValue: 0.03, fixedValue: 900, impact: 'medium', rarity: 'premium' },
  { id: 'tire_pressure', name: 'Tire Pressure Monitoring', category: 'safety', percentValue: 0.015, fixedValue: 300, impact: 'low', rarity: 'common' },
  { id: 'security_system', name: 'Anti-Theft Security System', category: 'safety', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'common' },
  { id: 'immobilizer', name: 'Engine Immobilizer', category: 'safety', percentValue: 0.015, fixedValue: 400, impact: 'low', rarity: 'common' },
  { id: 'alarm_system', name: 'Car Alarm System', category: 'safety', percentValue: 0.018, fixedValue: 450, impact: 'low', rarity: 'common' },
  { id: 'remote_start_security', name: 'Remote Start with Security', category: 'safety', percentValue: 0.025, fixedValue: 700, impact: 'medium', rarity: 'premium' },
  { id: 'child_safety_locks', name: 'Child Safety Door Locks', category: 'safety', percentValue: 0.008, fixedValue: 150, impact: 'low', rarity: 'common' },
  { id: 'daytime_running_lights', name: 'Daytime Running Lights', category: 'safety', percentValue: 0.012, fixedValue: 300, impact: 'low', rarity: 'common' },

  // Technology (15 features)
  { id: 'navigation_system', name: 'Built-in Navigation System', category: 'technology', percentValue: 0.025, fixedValue: 800, impact: 'medium', rarity: 'common' },
  { id: 'apple_carplay', name: 'Apple CarPlay', category: 'technology', percentValue: 0.02, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'android_auto', name: 'Android Auto', category: 'technology', percentValue: 0.02, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'wireless_carplay', name: 'Wireless Apple CarPlay', category: 'technology', percentValue: 0.03, fixedValue: 900, impact: 'high', rarity: 'premium' },
  { id: 'bluetooth', name: 'Bluetooth Connectivity', category: 'technology', percentValue: 0.015, fixedValue: 400, impact: 'medium', rarity: 'common' },
  { id: 'wireless_charging', name: 'Wireless Phone Charging', category: 'technology', percentValue: 0.025, fixedValue: 700, impact: 'medium', rarity: 'premium' },
  { id: 'usb_ports', name: 'Multiple USB Ports', category: 'technology', percentValue: 0.012, fixedValue: 250, impact: 'low', rarity: 'common' },
  { id: 'wifi_hotspot', name: 'Built-in WiFi Hotspot', category: 'technology', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'digital_display', name: 'Digital Instrument Display', category: 'technology', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'premium' },
  { id: 'hud', name: 'Head-Up Display', category: 'technology', percentValue: 0.055, fixedValue: 1800, impact: 'high', rarity: 'luxury' },
  { id: 'touchscreen_8', name: '8-inch Touchscreen', category: 'technology', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'common' },
  { id: 'touchscreen_10', name: '10-inch Touchscreen', category: 'technology', percentValue: 0.035, fixedValue: 900, impact: 'high', rarity: 'premium' },
  { id: 'touchscreen_12', name: '12+ inch Touchscreen', category: 'technology', percentValue: 0.05, fixedValue: 1500, impact: 'high', rarity: 'luxury' },
  { id: 'voice_control', name: 'Voice Control System', category: 'technology', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'premium' },
  { id: 'gesture_control', name: 'Gesture Control', category: 'technology', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'luxury' },

  // Comfort & Convenience (12 features)
  { id: 'leather_seats', name: 'Leather Seating', category: 'comfort', percentValue: 0.045, fixedValue: 1200, impact: 'high', rarity: 'premium' },
  { id: 'heated_front_seats', name: 'Heated Front Seats', category: 'comfort', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'heated_rear_seats', name: 'Heated Rear Seats', category: 'comfort', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'premium' },
  { id: 'cooled_seats', name: 'Ventilated/Cooled Seats', category: 'comfort', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'massage_seats', name: 'Massage Function Seats', category: 'comfort', percentValue: 0.055, fixedValue: 1800, impact: 'high', rarity: 'luxury' },
  { id: 'memory_seats', name: 'Memory Seat Settings', category: 'comfort', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'power_seats', name: 'Power Adjustable Seats', category: 'comfort', percentValue: 0.025, fixedValue: 700, impact: 'medium', rarity: 'common' },
  { id: 'keyless_entry', name: 'Keyless Entry', category: 'comfort', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'common' },
  { id: 'keyless_start', name: 'Push Button Start', category: 'comfort', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'remote_start', name: 'Remote Engine Start', category: 'comfort', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'power_windows', name: 'Power Windows', category: 'comfort', percentValue: 0.015, fixedValue: 300, impact: 'low', rarity: 'common' },
  { id: 'cruise_control', name: 'Cruise Control', category: 'comfort', percentValue: 0.02, fixedValue: 400, impact: 'medium', rarity: 'common' },

  // Performance (8 features)
  { id: 'turbo_engine', name: 'Turbocharged Engine', category: 'performance', percentValue: 0.065, fixedValue: 2000, impact: 'high', rarity: 'premium' },
  { id: 'supercharged', name: 'Supercharged Engine', category: 'performance', percentValue: 0.08, fixedValue: 2500, impact: 'high', rarity: 'luxury' },
  { id: 'sport_mode', name: 'Sport Driving Mode', category: 'performance', percentValue: 0.035, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'launch_control', name: 'Launch Control', category: 'performance', percentValue: 0.045, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'performance_tires', name: 'Performance Tires', category: 'performance', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'premium' },
  { id: 'sport_suspension', name: 'Sport Suspension', category: 'performance', percentValue: 0.04, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'limited_slip_diff', name: 'Limited Slip Differential', category: 'performance', percentValue: 0.035, fixedValue: 900, impact: 'medium', rarity: 'premium' },
  { id: 'performance_brakes', name: 'Performance Brake System', category: 'performance', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },

  // Interior Materials (10 features)
  { id: 'premium_leather', name: 'Premium Leather Interior', category: 'interior', percentValue: 0.055, fixedValue: 1500, impact: 'high', rarity: 'luxury' },
  { id: 'alcantara', name: 'Alcantara Upholstery', category: 'interior', percentValue: 0.045, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'suede_inserts', name: 'Suede Seat Inserts', category: 'interior', percentValue: 0.035, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'wood_trim', name: 'Real Wood Trim', category: 'interior', percentValue: 0.03, fixedValue: 700, impact: 'medium', rarity: 'premium' },
  { id: 'carbon_fiber_trim', name: 'Carbon Fiber Trim', category: 'interior', percentValue: 0.04, fixedValue: 1000, impact: 'high', rarity: 'luxury' },
  { id: 'metal_trim', name: 'Brushed Metal Trim', category: 'interior', percentValue: 0.025, fixedValue: 500, impact: 'medium', rarity: 'premium' },
  { id: 'soft_touch_dash', name: 'Soft-Touch Dashboard', category: 'interior', percentValue: 0.02, fixedValue: 400, impact: 'medium', rarity: 'common' },
  { id: 'premium_carpet', name: 'Premium Carpet Mats', category: 'interior', percentValue: 0.015, fixedValue: 300, impact: 'low', rarity: 'premium' },
  { id: 'floor_mats', name: 'All-Weather Floor Mats', category: 'interior', percentValue: 0.012, fixedValue: 200, impact: 'low', rarity: 'common' },
  { id: 'cargo_liner', name: 'Cargo Area Liner', category: 'interior', percentValue: 0.01, fixedValue: 150, impact: 'low', rarity: 'common' },

  // Exterior Features (12 features)
  { id: 'sunroof', name: 'Power Sunroof', category: 'exterior', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'panoramic_roof', name: 'Panoramic Sunroof', category: 'exterior', percentValue: 0.055, fixedValue: 1800, impact: 'high', rarity: 'luxury' },
  { id: 'convertible_top', name: 'Convertible Soft/Hard Top', category: 'exterior', percentValue: 0.12, fixedValue: 3500, impact: 'high', rarity: 'luxury' },
  { id: 'alloy_wheels', name: 'Alloy Wheels', category: 'exterior', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'premium_wheels', name: 'Premium Alloy Wheels', category: 'exterior', percentValue: 0.035, fixedValue: 900, impact: 'medium', rarity: 'premium' },
  { id: 'chrome_package', name: 'Chrome Exterior Package', category: 'exterior', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'premium' },
  { id: 'body_kit', name: 'Sport Body Kit', category: 'exterior', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'premium' },
  { id: 'tinted_windows', name: 'Factory Tinted Windows', category: 'exterior', percentValue: 0.015, fixedValue: 400, impact: 'low', rarity: 'common' },
  { id: 'roof_rails', name: 'Roof Rails/Rack', category: 'exterior', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'common' },
  { id: 'running_boards', name: 'Running Boards/Side Steps', category: 'exterior', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'tow_package', name: 'Towing Package', category: 'exterior', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'bed_liner', name: 'Spray-in Bed Liner', category: 'exterior', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'common' },

  // Audio & Entertainment (8 features)
  { id: 'premium_audio', name: 'Premium Sound System', category: 'audio', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'bose_audio', name: 'Bose Audio System', category: 'audio', percentValue: 0.045, fixedValue: 1300, impact: 'high', rarity: 'luxury' },
  { id: 'harman_kardon', name: 'Harman Kardon Audio', category: 'audio', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'bang_olufsen', name: 'Bang & Olufsen Audio', category: 'audio', percentValue: 0.055, fixedValue: 1800, impact: 'high', rarity: 'luxury' },
  { id: 'subwoofer', name: 'Powered Subwoofer', category: 'audio', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'premium' },
  { id: 'rear_entertainment', name: 'Rear Seat Entertainment', category: 'audio', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'satellite_radio', name: 'Satellite Radio Ready', category: 'audio', percentValue: 0.015, fixedValue: 300, impact: 'low', rarity: 'common' },
  { id: 'cd_player', name: 'CD Player', category: 'audio', percentValue: 0.01, fixedValue: 200, impact: 'low', rarity: 'common' },

  // Lighting Systems (6 features)
  { id: 'led_headlights', name: 'LED Headlights', category: 'lighting', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'adaptive_headlights', name: 'Adaptive/Auto Headlights', category: 'lighting', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'hid_headlights', name: 'HID/Xenon Headlights', category: 'lighting', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'premium' },
  { id: 'fog_lights', name: 'Fog Lights', category: 'lighting', percentValue: 0.015, fixedValue: 300, impact: 'low', rarity: 'common' },
  { id: 'ambient_lighting', name: 'Ambient Interior Lighting', category: 'lighting', percentValue: 0.02, fixedValue: 500, impact: 'medium', rarity: 'premium' },
  { id: 'led_taillights', name: 'LED Taillights', category: 'lighting', percentValue: 0.02, fixedValue: 400, impact: 'medium', rarity: 'premium' },

  // Climate Control (8 features)
  { id: 'auto_climate', name: 'Automatic Climate Control', category: 'climate', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'common' },
  { id: 'dual_zone_climate', name: 'Dual Zone Climate Control', category: 'climate', percentValue: 0.035, fixedValue: 900, impact: 'medium', rarity: 'premium' },
  { id: 'tri_zone_climate', name: 'Tri-Zone Climate Control', category: 'climate', percentValue: 0.045, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'rear_climate', name: 'Rear Climate Controls', category: 'climate', percentValue: 0.03, fixedValue: 700, impact: 'medium', rarity: 'premium' },
  { id: 'heated_steering', name: 'Heated Steering Wheel', category: 'climate', percentValue: 0.02, fixedValue: 400, impact: 'medium', rarity: 'premium' },
  { id: 'remote_climate', name: 'Remote Climate Control', category: 'climate', percentValue: 0.025, fixedValue: 600, impact: 'medium', rarity: 'premium' },
  { id: 'air_purifier', name: 'Air Purification System', category: 'climate', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'luxury' },
  { id: 'cabin_filter', name: 'Premium Cabin Air Filter', category: 'climate', percentValue: 0.012, fixedValue: 200, impact: 'low', rarity: 'common' },

  // Driver Assistance (ADAS) (12 features)
  { id: 'adaptive_cruise', name: 'Adaptive Cruise Control', category: 'adas', percentValue: 0.045, fixedValue: 1300, impact: 'high', rarity: 'premium' },
  { id: 'lane_keep_assist', name: 'Lane Keep Assist', category: 'adas', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'lane_departure', name: 'Lane Departure Warning', category: 'adas', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'collision_warning', name: 'Forward Collision Warning', category: 'adas', percentValue: 0.04, fixedValue: 1100, impact: 'high', rarity: 'premium' },
  { id: 'auto_emergency_brake', name: 'Automatic Emergency Braking', category: 'adas', percentValue: 0.045, fixedValue: 1300, impact: 'high', rarity: 'premium' },
  { id: 'pedestrian_detection', name: 'Pedestrian Detection', category: 'adas', percentValue: 0.035, fixedValue: 1000, impact: 'high', rarity: 'premium' },
  { id: 'traffic_sign', name: 'Traffic Sign Recognition', category: 'adas', percentValue: 0.025, fixedValue: 700, impact: 'medium', rarity: 'premium' },
  { id: 'driver_attention', name: 'Driver Attention Monitoring', category: 'adas', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'premium' },
  { id: 'auto_parking', name: 'Automatic Parking Assist', category: 'adas', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'self_parking', name: 'Self-Parking System', category: 'adas', percentValue: 0.055, fixedValue: 1800, impact: 'high', rarity: 'luxury' },
  { id: 'highway_assist', name: 'Highway Driving Assist', category: 'adas', percentValue: 0.05, fixedValue: 1500, impact: 'high', rarity: 'luxury' },
  { id: 'night_vision', name: 'Night Vision System', category: 'adas', percentValue: 0.06, fixedValue: 2000, impact: 'high', rarity: 'luxury' },

  // Luxury Materials (6 features)
  { id: 'nappa_leather', name: 'Nappa Leather Seats', category: 'luxury', percentValue: 0.065, fixedValue: 2000, impact: 'high', rarity: 'luxury' },
  { id: 'quilted_leather', name: 'Quilted Leather Upholstery', category: 'luxury', percentValue: 0.055, fixedValue: 1700, impact: 'high', rarity: 'luxury' },
  { id: 'exotic_wood', name: 'Exotic Wood Trim', category: 'luxury', percentValue: 0.045, fixedValue: 1400, impact: 'high', rarity: 'luxury' },
  { id: 'piano_black', name: 'Piano Black Trim', category: 'luxury', percentValue: 0.03, fixedValue: 800, impact: 'medium', rarity: 'luxury' },
  { id: 'crystal_accents', name: 'Crystal Interior Accents', category: 'luxury', percentValue: 0.04, fixedValue: 1200, impact: 'high', rarity: 'luxury' },
  { id: 'hand_stitched', name: 'Hand-Stitched Interior', category: 'luxury', percentValue: 0.07, fixedValue: 2200, impact: 'high', rarity: 'luxury' },

  // Performance Packages (8 features)
  { id: 'sport_package', name: 'Sport Package', category: 'packages', percentValue: 0.08, fixedValue: 2500, impact: 'high', rarity: 'premium' },
  { id: 'performance_package', name: 'Performance Package', category: 'packages', percentValue: 0.1, fixedValue: 3000, impact: 'high', rarity: 'luxury' },
  { id: 'track_package', name: 'Track Package', category: 'packages', percentValue: 0.12, fixedValue: 3500, impact: 'high', rarity: 'luxury' },
  { id: 'cold_weather', name: 'Cold Weather Package', category: 'packages', percentValue: 0.035, fixedValue: 1000, impact: 'medium', rarity: 'premium' },
  { id: 'technology_package', name: 'Technology Package', category: 'packages', percentValue: 0.06, fixedValue: 1800, impact: 'high', rarity: 'premium' },
  { id: 'luxury_package', name: 'Luxury Package', category: 'packages', percentValue: 0.085, fixedValue: 2800, impact: 'high', rarity: 'luxury' },
  { id: 'off_road_package', name: 'Off-Road Package', category: 'packages', percentValue: 0.055, fixedValue: 1600, impact: 'high', rarity: 'premium' },
  { id: 'appearance_package', name: 'Appearance Package', category: 'packages', percentValue: 0.04, fixedValue: 1200, impact: 'medium', rarity: 'premium' }
];
