
import React from 'react';
import { Car, FileText, Search, Camera } from 'lucide-react';

export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'photo';

export interface ValuationService {
  id: ValuationServiceId;
  title: string;
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
}

export const services: ValuationService[] = [
  {
    id: 'vin',
    title: 'VIN Lookup',
    description: 'Enter your vehicle identification number for accurate results',
    icon: <Search className="h-4 w-4" />,
  },
  {
    id: 'plate',
    title: 'License Plate',
    description: 'Lookup your vehicle using license plate number and state',
    icon: <Car className="h-4 w-4" />,
  },
  {
    id: 'manual',
    title: 'Manual Entry',
    description: 'Enter your vehicle details manually',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'photo',
    title: 'Photo Lookup',
    description: 'Upload a photo of your vehicle for identification',
    icon: <Camera className="h-4 w-4" />,
    premium: true,
  },
];
