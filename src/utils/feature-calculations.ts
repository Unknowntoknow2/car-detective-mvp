
import { FeatureOption } from '@/types/premium-valuation';

// Update the feature options to not include icon property
const featureOptions: FeatureOption[] = [
  { id: "sunroof", name: "Sunroof", value: 750, category: "comfort" },
  { id: "leather", name: "Leather Seats", value: 1200, category: "comfort" },
  { id: "navigation", name: "Navigation System", value: 1000, category: "technology" },
  { id: "premium_audio", name: "Premium Audio", value: 850, category: "technology" },
  { id: "parking_sensors", name: "Parking Sensors", value: 650, category: "safety" },
  { id: "backup_camera", name: "Backup Camera", value: 500, category: "safety" },
  { id: "alloy_wheels", name: "Alloy Wheels", value: 600, category: "exterior" },
  { id: "third_row_seating", name: "Third Row Seating", value: 1100, category: "capacity" },
  { id: "towing_package", name: "Towing Package", value: 800, category: "utility" },
  { id: "AWD", name: "All-Wheel Drive", value: 1500, category: "drivetrain" }
];

export const calculateFeaturesValue = (selectedFeatureIds: string[]): number => {
  if (!selectedFeatureIds || selectedFeatureIds.length === 0) {
    return 0;
  }
  
  return selectedFeatureIds.reduce((total, featureId) => {
    const feature = featureOptions.find(f => f.id === featureId);
    return total + (feature?.value || 0);
  }, 0);
};

export const getFeatureOptions = (): FeatureOption[] => {
  return featureOptions;
};

export const getCategorizedFeatureOptions = (): Record<string, FeatureOption[]> => {
  return featureOptions.reduce((acc, feature) => {
    const category = feature.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, FeatureOption[]>);
};
