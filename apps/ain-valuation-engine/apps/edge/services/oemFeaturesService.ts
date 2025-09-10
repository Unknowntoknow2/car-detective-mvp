export interface OEMFeaturesResult {
  vin: string;
  features_json: Record<string, any>;
  confidence: number;
  rawPayload: any;
}

// Comprehensive manufacturer-specific feature extractors
const MANUFACTURER_EXTRACTORS = {
  TOYOTA: {
    safety_systems: {
      'Toyota Safety Sense': ['collision_warning', 'lane_departure', 'adaptive_cruise'],
      'Pre-Collision System': ['collision_warning', 'pedestrian_detection'],
      'Lane Departure Alert': ['lane_departure', 'lane_keeping_assist'],
      'Dynamic Radar Cruise Control': ['adaptive_cruise'],
      'Blind Spot Monitor': ['blind_spot_monitoring'],
      'Rear Cross Traffic Alert': ['cross_traffic_alert']
    },
    infotainment: {
      'Toyota Entune': ['infotainment_system', 'voice_control'],
      'Apple CarPlay': ['apple_carplay'],
      'Android Auto': ['android_auto'],
      'Wireless Charging': ['wireless_charging'],
      'JBL Premium Audio': ['premium_audio'],
      'Navigation System': ['built_in_navigation']
    },
    comfort: {
      'Heated Seats': ['heated_front_seats'],
      'Ventilated Seats': ['ventilated_seats'],
      'Leather-Trimmed Seats': ['leather_seats'],
      'Power Moonroof': ['sunroof'],
      'Dual-Zone Climate Control': ['dual_zone_climate'],
      'Smart Key System': ['keyless_entry']
    }
  },
  HONDA: {
    safety_systems: {
      'Honda Sensing': ['collision_warning', 'lane_departure', 'adaptive_cruise'],
      'Collision Mitigation Braking': ['collision_warning', 'auto_emergency_braking'],
      'Road Departure Mitigation': ['lane_departure', 'road_departure_mitigation'],
      'Adaptive Cruise Control': ['adaptive_cruise'],
      'Blind Spot Information': ['blind_spot_monitoring'],
      'Cross Traffic Monitor': ['cross_traffic_alert']
    },
    infotainment: {
      'Honda Display Audio': ['infotainment_system'],
      'Apple CarPlay': ['apple_carplay'],
      'Android Auto': ['android_auto'],
      'Wireless Phone Charging': ['wireless_charging'],
      'Premium Audio System': ['premium_audio'],
      'Satellite-Linked Navigation': ['built_in_navigation']
    },
    comfort: {
      'Heated Front Seats': ['heated_front_seats'],
      'Leather-Appointed Seating': ['leather_seats'],
      'One-Touch Power Moonroof': ['sunroof'],
      'Automatic Climate Control': ['climate_control'],
      'Smart Entry': ['keyless_entry'],
      'Remote Engine Start': ['remote_start']
    }
  },
  FORD: {
    safety_systems: {
      'Ford Co-Pilot360': ['collision_warning', 'lane_departure', 'adaptive_cruise'],
      'Pre-Collision Assist': ['collision_warning', 'pedestrian_detection'],
      'Lane-Keeping System': ['lane_departure', 'lane_keeping_assist'],
      'Adaptive Cruise Control': ['adaptive_cruise'],
      'BLIS with Cross-Traffic Alert': ['blind_spot_monitoring', 'cross_traffic_alert'],
      'Enhanced Active Park Assist': ['park_assist']
    },
    infotainment: {
      'SYNC 4': ['infotainment_system', 'voice_control'],
      'Apple CarPlay': ['apple_carplay'],
      'Android Auto': ['android_auto'],
      'Wireless Charging Pad': ['wireless_charging'],
      'B&O Sound System': ['premium_audio'],
      'FordPass Connect': ['connected_services']
    },
    comfort: {
      'Heated Front Seats': ['heated_front_seats'],
      'Cooled Front Seats': ['ventilated_seats'],
      'Leather-Trimmed Seats': ['leather_seats'],
      'Panoramic Vista Roof': ['sunroof'],
      'Dual-Zone Electronic Climate Control': ['dual_zone_climate'],
      'Intelligent Access': ['keyless_entry']
    }
  },
  BMW: {
    safety_systems: {
      'Driving Assistant': ['collision_warning', 'lane_departure'],
      'Active Driving Assistant': ['collision_warning', 'lane_departure', 'blind_spot_monitoring'],
      'Adaptive Cruise Control': ['adaptive_cruise'],
      'Lane Departure Warning': ['lane_departure'],
      'Forward Collision Warning': ['collision_warning'],
      'Parking Assistant': ['park_assist']
    },
    infotainment: {
      'iDrive 7.0': ['infotainment_system'],
      'Apple CarPlay': ['apple_carplay'],
      'Android Auto': ['android_auto'],
      'Wireless Charging': ['wireless_charging'],
      'Harman Kardon Surround Sound': ['premium_audio'],
      'BMW Live Cockpit': ['digital_cockpit']
    },
    comfort: {
      'Heated Front Seats': ['heated_front_seats'],
      'Ventilated Front Seats': ['ventilated_seats'],
      'Dakota Leather Upholstery': ['leather_seats'],
      'Panoramic Moonroof': ['sunroof'],
      'Automatic Climate Control': ['climate_control'],
      'Comfort Access Keyless Entry': ['keyless_entry']
    }
  },
  MERCEDES: {
    safety_systems: {
      'Mercedes-Benz User Experience': ['collision_warning', 'lane_departure'],
      'Active Brake Assist': ['collision_warning', 'auto_emergency_braking'],
      'Active Lane Keeping Assist': ['lane_departure', 'lane_keeping_assist'],
      'Adaptive Cruise Control': ['adaptive_cruise'],
      'Blind Spot Assist': ['blind_spot_monitoring'],
      'Active Parking Assist': ['park_assist']
    },
    infotainment: {
      'MBUX': ['infotainment_system', 'voice_control'],
      'Apple CarPlay': ['apple_carplay'],
      'Android Auto': ['android_auto'],
      'Wireless Charging': ['wireless_charging'],
      'Burmester Surround Sound': ['premium_audio'],
      'COMAND Navigation': ['built_in_navigation']
    },
    comfort: {
      'Heated Front Seats': ['heated_front_seats'],
      'Multicontour Front Seats': ['ventilated_seats'],
      'MB-Tex Upholstery': ['premium_upholstery'],
      'Power Panorama Roof': ['sunroof'],
      'Dual-Zone Automatic Climate Control': ['dual_zone_climate'],
      'KEYLESS-GO': ['keyless_entry']
    }
  }
};

function extractFeaturesFromVIN(vin: string): OEMFeaturesResult {
  // Decode manufacturer from VIN (positions 1-3)
  const wmi = vin.substring(0, 3);
  let manufacturer = 'UNKNOWN';
  
  // Common WMI mappings
  const wmiMappings: { [key: string]: string } = {
    '1G1': 'CHEVROLET', '1G6': 'CADILLAC', '1GC': 'CHEVROLET',
    '1FT': 'FORD', '1FA': 'FORD', '1FM': 'FORD',
    '1HG': 'HONDA', '1HT': 'HONDA', '2HG': 'HONDA',
    'JTD': 'TOYOTA', 'JTM': 'TOYOTA', '4T1': 'TOYOTA',
    'WBA': 'BMW', 'WBS': 'BMW', 'WBY': 'BMW',
    'WDD': 'MERCEDES', 'WDF': 'MERCEDES', '4JG': 'MERCEDES',
    'JM1': 'MAZDA', 'JM3': 'MAZDA',
    'KNA': 'KIA', 'KNM': 'KIA',
    'KMH': 'HYUNDAI', 'KMF': 'HYUNDAI'
  };
  
  for (const [prefix, make] of Object.entries(wmiMappings)) {
    if (wmi.startsWith(prefix)) {
      manufacturer = make;
      break;
    }
  }
  
  // Get model year from VIN (position 10)
  const yearCode = vin.charAt(9);
  const yearMapping: { [key: string]: number } = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
    'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
    'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025
  };
  
  const modelYear = yearMapping[yearCode] || 2020; // Default to 2020 if unknown
  
  // Extract features based on manufacturer and year
  const extractorData = MANUFACTURER_EXTRACTORS[manufacturer as keyof typeof MANUFACTURER_EXTRACTORS];
  const features: any = {
    safety_systems: {},
    infotainment: {},
    comfort: {},
    powertrain: {},
    exterior: {},
    interior: {}
  };
  
  let confidence = 0.7; // Base confidence
  
  if (extractorData) {
    confidence = 0.85; // Higher confidence for known manufacturers
    
    // Apply manufacturer-specific features
    Object.entries(extractorData.safety_systems).forEach(([featureName, mappedFeatures]) => {
      mappedFeatures.forEach(feature => {
        features.safety_systems[feature] = true;
      });
    });
    
    Object.entries(extractorData.infotainment).forEach(([featureName, mappedFeatures]) => {
      mappedFeatures.forEach(feature => {
        features.infotainment[feature] = true;
      });
    });
    
    Object.entries(extractorData.comfort).forEach(([featureName, mappedFeatures]) => {
      mappedFeatures.forEach(feature => {
        features.comfort[feature] = true;
      });
    });
    
    // Year-based feature adjustments
    if (modelYear >= 2020) {
      features.safety_systems.collision_warning = true;
      features.infotainment.apple_carplay = true;
      confidence += 0.05;
    }
    
    if (modelYear >= 2022) {
      features.safety_systems.lane_departure = true;
      features.infotainment.android_auto = true;
      confidence += 0.05;
    }
    
    // Luxury brand enhancements
    if (['BMW', 'MERCEDES', 'LEXUS', 'AUDI'].includes(manufacturer)) {
      features.comfort.leather_seats = true;
      features.comfort.premium_audio = true;
      features.safety_systems.adaptive_cruise = true;
      confidence += 0.05;
    }
  } else {
    // Generic features for unknown manufacturers
    features.safety_systems.basic_airbags = true;
    features.infotainment.radio = true;
    features.comfort.air_conditioning = true;
    confidence = 0.6;
  }
  
  return {
    vin,
    features_json: features,
    confidence: Math.min(confidence, 0.95),
    rawPayload: {
      vin,
      manufacturer,
      modelYear,
      wmi,
      extractionMethod: 'VIN_DECODE',
      timestamp: new Date().toISOString()
    }
  };
}

export async function fetchOEMFeatures(vin: string): Promise<OEMFeaturesResult | null> {
  try {
    // Validate VIN format (17 characters, alphanumeric except I, O, Q)
    if (!vin || vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      console.warn('Invalid VIN format:', vin);
      return null;
    }
    
    // For now, use VIN-based extraction
    // In production, this would make API calls to manufacturer databases
    const result = extractFeaturesFromVIN(vin.toUpperCase());
    
    console.log(`Extracted OEM features for VIN ${vin}:`, {
      manufacturer: result.rawPayload.manufacturer,
      year: result.rawPayload.modelYear,
      featureCount: Object.keys(result.features_json.safety_systems).length + 
                   Object.keys(result.features_json.infotainment).length + 
                   Object.keys(result.features_json.comfort).length,
      confidence: result.confidence
    });
    
    return result;
    
  } catch (error) {
    console.error('Error fetching OEM features:', error);
    return null;
  }
}
