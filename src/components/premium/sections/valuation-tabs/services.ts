
import React from 'react';
import { Car, FileText, ClipboardEdit, Star, BrainCog, Camera, Users, BarChart3, LineChart, FileCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'ai' | 'condition' | 'photo' | 'dealers' | 'market' | 'forecast' | 'carfax';

export interface ValuationService {
  id: ValuationServiceId;
  title: string;
  description: string;
  icon: React.ReactNode;
  premium: boolean;
}

// Create icon components instead of using JSX directly
const createIconComponent = (Icon: LucideIcon) => React.createElement(Icon, { className: "h-4 w-4" });

export const services: ValuationService[] = [
  {
    id: 'vin',
    title: 'VIN Lookup',
    description: 'Enter your Vehicle Identification Number',
    icon: createIconComponent(Car),
    premium: false
  },
  {
    id: 'plate',
    title: 'License Plate',
    description: 'Enter your license plate and state',
    icon: createIconComponent(FileText),
    premium: false
  },
  {
    id: 'manual',
    title: 'Manual Entry',
    description: 'Enter your vehicle details manually',
    icon: createIconComponent(ClipboardEdit),
    premium: false
  },
  {
    id: 'condition',
    title: 'Condition',
    description: 'Evaluate your vehicle condition',
    icon: createIconComponent(Star),
    premium: true
  },
  {
    id: 'ai',
    title: 'AI Analysis',
    description: 'Use AI to get a comprehensive analysis',
    icon: createIconComponent(BrainCog),
    premium: true
  },
  {
    id: 'photo',
    title: 'Photo Analysis',
    description: 'Upload photos for condition assessment',
    icon: createIconComponent(Camera),
    premium: true
  },
  {
    id: 'dealers',
    title: 'Dealer Offers',
    description: 'Connect with local dealers',
    icon: createIconComponent(Users),
    premium: true
  },
  {
    id: 'market',
    title: 'Market Analysis',
    description: 'Compare with similar vehicles',
    icon: createIconComponent(BarChart3),
    premium: true
  },
  {
    id: 'forecast',
    title: 'Value Forecast',
    description: 'See projected future value',
    icon: createIconComponent(LineChart),
    premium: true
  },
  {
    id: 'carfax',
    title: 'CARFAX Report',
    description: 'Vehicle history information',
    icon: createIconComponent(FileCheck),
    premium: true
  }
];
