
import { FeatureOption } from '@/types/premium-valuation';

export const featureOptions: FeatureOption[] = [
  { id: 'leather', name: 'Leather Seats', icon: 'car', value: 800 },
  { id: 'sunroof', name: 'Sunroof/Moonroof', icon: 'sun', value: 600 },
  { id: 'navigation', name: 'Navigation System', icon: 'map', value: 500 },
  { id: 'premium_audio', name: 'Premium Audio', icon: 'headphones', value: 400 },
  { id: 'backup_camera', name: 'Backup Camera', icon: 'camera', value: 300 },
  { id: 'heated_seats', name: 'Heated Seats', icon: 'thermometer', value: 450 },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', value: 150 },
  { id: 'third_row', name: 'Third Row Seating', icon: 'users', value: 700 },
  { id: 'alloy_wheels', name: 'Alloy Wheels', icon: 'circle', value: 350 },
  { id: 'parking_sensors', name: 'Parking Sensors', icon: 'bell', value: 250 },
  { id: 'power_liftgate', name: 'Power Liftgate', icon: 'chevron-up', value: 400 },
  { id: 'remote_start', name: 'Remote Start', icon: 'key', value: 300 }
];

export const calculateFeatureValue = (features: string[]): number => {
  return features.reduce((total, featureId) => {
    const featureOption = featureOptions.find(f => f.id === featureId);
    return total + (featureOption?.value || 0);
  }, 0);
};
