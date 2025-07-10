// Package and Feature Value Adjustments

export interface PackageAdjustment {
  name: string;
  value: number;
  description: string;
}

/**
 * Detect valuable packages and options from trim string or features
 */
export function getPackageAdjustments(
  make: string,
  model: string,
  trim: string,
  features?: string[]
): PackageAdjustment[] {
  const adjustments: PackageAdjustment[] = [];
  const trimLower = trim.toLowerCase();
  const featuresList = features?.map(f => f.toLowerCase()) || [];
  
  // Toyota package detection
  if (make.toLowerCase() === 'toyota') {
    // Audio/Technology packages
    if (trimLower.includes('audio package') || featuresList.includes('audio package')) {
      adjustments.push({
        name: 'Audio Package',
        value: 1200,
        description: 'Premium audio system upgrade'
      });
    }
    
    // Safety packages
    if (trimLower.includes('blind spot') || featuresList.includes('blind spot monitor') || 
        trimLower.includes('bsm')) {
      adjustments.push({
        name: 'Blind Spot Monitor',
        value: 800,
        description: 'Advanced safety feature'
      });
    }
    
    // Convenience packages
    if (trimLower.includes('convenience') || trimLower.includes('moonroof') || 
        trimLower.includes('sunroof')) {
      adjustments.push({
        name: 'Convenience Package',
        value: 850,
        description: 'Moonroof and convenience features'
      });
    }
    
    // Navigation systems
    if (trimLower.includes('navigation') || trimLower.includes('nav') ||
        featuresList.includes('navigation')) {
      adjustments.push({
        name: 'Navigation System',
        value: 600,
        description: 'Built-in GPS navigation'
      });
    }
  }
  
  // Honda package detection
  if (make.toLowerCase() === 'honda') {
    if (trimLower.includes('honda sensing') || featuresList.includes('honda sensing')) {
      adjustments.push({
        name: 'Honda Sensing',
        value: 1000,
        description: 'Advanced safety and driver assistance'
      });
    }
    
    if (trimLower.includes('leather') || featuresList.includes('leather')) {
      adjustments.push({
        name: 'Leather Package',
        value: 1500,
        description: 'Leather-appointed seating'
      });
    }
  }
  
  // Universal high-value features
  const universalFeatures = [
    { keywords: ['leather', 'leather seats'], name: 'Leather Seating', value: 1500 },
    { keywords: ['heated seats', 'seat heating'], name: 'Heated Seats', value: 600 },
    { keywords: ['remote start', 'remote engine'], name: 'Remote Start', value: 400 },
    { keywords: ['adaptive cruise', 'acc'], name: 'Adaptive Cruise Control', value: 800 },
    { keywords: ['lane departure', 'lane keep'], name: 'Lane Keep Assist', value: 500 },
    { keywords: ['wireless charging', 'qi charging'], name: 'Wireless Charging', value: 300 },
    { keywords: ['premium wheels', 'alloy wheels'], name: 'Premium Wheels', value: 800 }
  ];
  
  universalFeatures.forEach(feature => {
    const hasFeature = feature.keywords.some(keyword => 
      trimLower.includes(keyword) || featuresList.includes(keyword)
    );
    
    if (hasFeature && !adjustments.some(adj => adj.name === feature.name)) {
      adjustments.push({
        name: feature.name,
        value: feature.value,
        description: `Factory ${feature.name.toLowerCase()} option`
      });
    }
  });
  
  return adjustments;
}

/**
 * Calculate total package value adjustment
 */
export function getTotalPackageValue(
  make: string,
  model: string,
  trim: string,
  features?: string[]
): number {
  const adjustments = getPackageAdjustments(make, model, trim, features);
  return adjustments.reduce((total, adj) => total + adj.value, 0);
}