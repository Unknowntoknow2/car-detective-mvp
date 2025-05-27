
import { FeatureOption } from '@/types/premium-valuation';

// Mock feature data with all required properties
export const MOCK_FEATURES: FeatureOption[] = [
  { id: 'leather-seats', name: 'Leather Seats', category: 'Interior', valueImpact: 1200, description: 'Premium leather upholstery' },
  { id: 'navigation', name: 'Navigation System', category: 'Technology', valueImpact: 800, description: 'Built-in GPS navigation' },
  { id: 'backup-camera', name: 'Backup Camera', category: 'Safety', valueImpact: 600, description: 'Rear-view camera system' },
  { id: 'sunroof', name: 'Sunroof/Moonroof', category: 'Exterior', valueImpact: 900, description: 'Power sunroof or moonroof' },
  { id: 'heated-seats', name: 'Heated Seats', category: 'Comfort', valueImpact: 500, description: 'Front heated seats' },
  { id: 'premium-audio', name: 'Premium Audio', category: 'Technology', valueImpact: 700, description: 'High-end sound system' },
  { id: 'awd', name: 'All-Wheel Drive', category: 'Performance', valueImpact: 1500, description: 'AWD or 4WD system' },
  { id: 'remote-start', name: 'Remote Start', category: 'Convenience', valueImpact: 400, description: 'Remote engine start capability' },
  { id: 'keyless-entry', name: 'Keyless Entry', category: 'Convenience', valueImpact: 300, description: 'Push-button start and keyless entry' },
  { id: 'parking-sensors', name: 'Parking Sensors', category: 'Safety', valueImpact: 450, description: 'Front and rear parking sensors' }
];

export const calculateFeatureValue = (selectedFeatures: string[]): number => {
  return selectedFeatures.reduce((total, featureId) => {
    const feature = MOCK_FEATURES.find(f => f.id === featureId);
    return total + (feature?.valueImpact || 0);
  }, 0);
};

export const getSelectedFeatures = (selectedIds: string[]): FeatureOption[] => {
  return MOCK_FEATURES.filter(feature => selectedIds.includes(feature.id));
};

export const getFeaturesByCategory = (category: string): FeatureOption[] => {
  return MOCK_FEATURES.filter(feature => feature.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(MOCK_FEATURES.map(feature => feature.category))];
};
