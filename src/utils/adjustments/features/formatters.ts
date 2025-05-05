
/**
 * Gets standardized feature names from raw input
 * Helps match user input to our feature database
 * @param rawFeatures Array of raw feature names
 * @returns Array of standardized feature names
 */
export function standardizeFeatureNames(rawFeatures: string[]): string[] {
  return rawFeatures.map(feature => {
    const normalizedFeature = feature.toLowerCase().trim();
    
    // Map common variations to standard names
    if (normalizedFeature.includes('leather')) return 'leather seats';
    if (normalizedFeature.includes('sun') && normalizedFeature.includes('roof')) return 'sunroof';
    if (normalizedFeature.includes('moon') && normalizedFeature.includes('roof')) return 'sunroof';
    if (normalizedFeature.includes('pano') && normalizedFeature.includes('roof')) return 'panoramic roof';
    if (normalizedFeature.includes('nav')) return 'navigation system';
    if (normalizedFeature.includes('premium') && normalizedFeature.includes('sound')) return 'premium audio';
    if (normalizedFeature.includes('premium') && normalizedFeature.includes('audio')) return 'premium audio';
    if (normalizedFeature.includes('heated') && normalizedFeature.includes('seat')) return 'heated seats';
    if (normalizedFeature.includes('cool') && normalizedFeature.includes('seat')) return 'ventilated seats';
    if (normalizedFeature.includes('vent') && normalizedFeature.includes('seat')) return 'ventilated seats';
    
    // Return as-is if no mapping found
    return normalizedFeature;
  });
}
