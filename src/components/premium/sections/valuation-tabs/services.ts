
import React from 'react';
import { Car, License, ClipboardEdit, Star, BrainCog } from 'lucide-react';

export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'ai' | 'condition';

export interface ValuationService {
  id: ValuationServiceId;
  title: string;
  description: string;
  icon: React.ReactNode;
  premium: boolean;
}

export const services: ValuationService[] = [
  {
    id: 'vin',
    title: 'VIN Lookup',
    description: 'Enter your Vehicle Identification Number',
    icon: <Car className="h-4 w-4" />,
    premium: false
  },
  {
    id: 'plate',
    title: 'License Plate',
    description: 'Enter your license plate and state',
    icon: <License className="h-4 w-4" />,
    premium: false
  },
  {
    id: 'manual',
    title: 'Manual Entry',
    description: 'Enter your vehicle details manually',
    icon: <ClipboardEdit className="h-4 w-4" />,
    premium: false
  },
  {
    id: 'condition',
    title: 'Condition',
    description: 'Evaluate your vehicle condition',
    icon: <Star className="h-4 w-4" />,
    premium: true
  },
  {
    id: 'ai',
    title: 'AI Analysis',
    description: 'Use AI to get a comprehensive analysis',
    icon: <BrainCog className="h-4 w-4" />,
    premium: true
  }
];
