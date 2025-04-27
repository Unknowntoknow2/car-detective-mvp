
import { Make, Model } from './types.ts';

export const getFallbackMakes = (): Make[] => [
  { id: '1', make_name: 'Toyota', logo_url: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { id: '2', make_name: 'Honda', logo_url: 'https://www.carlogos.org/car-logos/honda-logo.png' },
  { id: '3', make_name: 'Ford', logo_url: 'https://www.carlogos.org/car-logos/ford-logo.png' },
  { id: '4', make_name: 'Chevrolet', logo_url: 'https://www.carlogos.org/car-logos/chevrolet-logo.png' },
  { id: '5', make_name: 'Nissan', logo_url: 'https://www.carlogos.org/car-logos/nissan-logo.png' },
  { id: '6', make_name: 'BMW', logo_url: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { id: '7', make_name: 'Mercedes-Benz', logo_url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { id: '8', make_name: 'Audi', logo_url: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { id: '9', make_name: 'Lexus', logo_url: 'https://www.carlogos.org/car-logos/lexus-logo.png' },
  { id: '10', make_name: 'Hyundai', logo_url: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
  { id: '11', make_name: 'Kia', logo_url: 'https://www.carlogos.org/car-logos/kia-logo.png' },
  { id: '12', make_name: 'Subaru', logo_url: 'https://www.carlogos.org/car-logos/subaru-logo.png' },
];

export const getFallbackModels = (makeId: string): Model[] => {
  const modelsByMake: Record<string, string[]> = {
    '1': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner'],
    '2': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey'],
    '3': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Focus'],
    '4': ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro'],
    '5': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier'],
    '6': ['3 Series', '5 Series', 'X3', 'X5', 'M3'],
    '7': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'],
    '8': ['A4', 'A6', 'Q5', 'Q7', 'e-tron'],
    '9': ['ES', 'RX', 'NX', 'LS', 'IS'],
    '10': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade'],
    '11': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride'],
    '12': ['Forester', 'Outback', 'Impreza', 'Crosstrek', 'Legacy'],
  };

  const defaultModels = ['Base', 'Standard', 'Deluxe', 'Premium'];
  const makeModels = modelsByMake[makeId] || defaultModels;

  return makeModels.map((model, index) => ({
    id: `${makeId}-${index}`,
    make_id: makeId,
    model_name: model
  }));
};
