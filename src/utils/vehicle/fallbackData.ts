
import { Make, Model } from '@/hooks/types/vehicle';

export const getFallbackMakes = (): Make[] => [
  { id: '1', make_name: 'Toyota', logo_url: 'https://www.carlogos.org/car-logos/toyota-logo.png', country_of_origin: 'Japan' },
  { id: '2', make_name: 'Honda', logo_url: 'https://www.carlogos.org/car-logos/honda-logo.png', country_of_origin: 'Japan' },
  { id: '3', make_name: 'Ford', logo_url: 'https://www.carlogos.org/car-logos/ford-logo.png', country_of_origin: 'United States' },
  { id: '4', make_name: 'Chevrolet', logo_url: 'https://www.carlogos.org/car-logos/chevrolet-logo.png', country_of_origin: 'United States' },
  { id: '5', make_name: 'Nissan', logo_url: 'https://www.carlogos.org/car-logos/nissan-logo.png', country_of_origin: 'Japan' },
  { id: '6', make_name: 'BMW', logo_url: 'https://www.carlogos.org/car-logos/bmw-logo.png', country_of_origin: 'Germany' },
  { id: '7', make_name: 'Mercedes-Benz', logo_url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png', country_of_origin: 'Germany' },
  { id: '8', make_name: 'Audi', logo_url: 'https://www.carlogos.org/car-logos/audi-logo.png', country_of_origin: 'Germany' },
  { id: '9', make_name: 'Lexus', logo_url: 'https://www.carlogos.org/car-logos/lexus-logo.png', country_of_origin: 'Japan' },
  { id: '10', make_name: 'Hyundai', logo_url: 'https://www.carlogos.org/car-logos/hyundai-logo.png', country_of_origin: 'South Korea' },
  { id: '11', make_name: 'Kia', logo_url: 'https://www.carlogos.org/car-logos/kia-logo.png', country_of_origin: 'South Korea' },
  { id: '12', make_name: 'Subaru', logo_url: 'https://www.carlogos.org/car-logos/subaru-logo.png', country_of_origin: 'Japan' },
  { id: '13', make_name: 'Volkswagen', logo_url: 'https://www.carlogos.org/car-logos/volkswagen-logo.png', country_of_origin: 'Germany' },
  { id: '14', make_name: 'Mazda', logo_url: 'https://www.carlogos.org/car-logos/mazda-logo.png', country_of_origin: 'Japan' },
  { id: '15', make_name: 'Volvo', logo_url: 'https://www.carlogos.org/car-logos/volvo-logo.png', country_of_origin: 'Sweden' },
  { id: '16', make_name: 'Jeep', logo_url: 'https://www.carlogos.org/car-logos/jeep-logo.png', country_of_origin: 'United States' },
  { id: '17', make_name: 'Acura', logo_url: 'https://www.carlogos.org/car-logos/acura-logo.png', country_of_origin: 'Japan' },
  { id: '18', make_name: 'Infiniti', logo_url: 'https://www.carlogos.org/car-logos/infiniti-logo.png', country_of_origin: 'Japan' },
  { id: '19', make_name: 'Cadillac', logo_url: 'https://www.carlogos.org/car-logos/cadillac-logo.png', country_of_origin: 'United States' },
  { id: '20', make_name: 'Buick', logo_url: 'https://www.carlogos.org/car-logos/buick-logo.png', country_of_origin: 'United States' },
  { id: '21', make_name: 'Porsche', logo_url: 'https://www.carlogos.org/car-logos/porsche-logo.png', country_of_origin: 'Germany' },
  { id: '22', make_name: 'Land Rover', logo_url: 'https://www.carlogos.org/car-logos/land-rover-logo.png', country_of_origin: 'United Kingdom' },
  { id: '23', make_name: 'Jaguar', logo_url: 'https://www.carlogos.org/car-logos/jaguar-logo.png', country_of_origin: 'United Kingdom' },
  { id: '24', make_name: 'Tesla', logo_url: 'https://www.carlogos.org/car-logos/tesla-logo.png', country_of_origin: 'United States' },
  { id: '25', make_name: 'GMC', logo_url: 'https://www.carlogos.org/car-logos/gmc-logo.png', country_of_origin: 'United States' },
  { id: '26', make_name: 'Chrysler', logo_url: 'https://www.carlogos.org/car-logos/chrysler-logo.png', country_of_origin: 'United States' },
  { id: '27', make_name: 'Dodge', logo_url: 'https://www.carlogos.org/car-logos/dodge-logo.png', country_of_origin: 'United States' },
  { id: '28', make_name: 'RAM', logo_url: 'https://www.carlogos.org/car-logos/ram-logo.png', country_of_origin: 'United States' },
  { id: '29', make_name: 'MINI', logo_url: 'https://www.carlogos.org/car-logos/mini-logo.png', country_of_origin: 'United Kingdom' },
  { id: '30', make_name: 'Genesis', logo_url: 'https://www.carlogos.org/car-logos/genesis-logo.png', country_of_origin: 'South Korea' },
  { id: '31', make_name: 'Mitsubishi', logo_url: 'https://www.carlogos.org/car-logos/mitsubishi-logo.png', country_of_origin: 'Japan' },
  { id: '32', make_name: 'Lincoln', logo_url: 'https://www.carlogos.org/car-logos/lincoln-logo.png', country_of_origin: 'United States' },
  { id: '33', make_name: 'Rivian', logo_url: 'https://www.carlogos.org/car-logos/rivian-logo.png', country_of_origin: 'United States' },
  { id: '34', make_name: 'Lucid', logo_url: 'https://www.carlogos.org/car-logos/lucid-motors-logo.png', country_of_origin: 'United States' }
];

export const getFallbackModels = (makeId: string): Model[] => {
  const modelsByMake: Record<string, string[]> = {
    '1': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner', 'Prius', 'Sienna', 'Tundra', 'Land Cruiser'],
    '2': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Passport', 'Ridgeline', 'Insight'],
    '3': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Bronco', 'Edge', 'Expedition', 'Ranger', 'Focus', 'Fusion'],
    '4': ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro', 'Corvette', 'Suburban', 'Traverse', 'Blazer', 'Colorado'],
    '5': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Maxima', 'Murano', 'Armada', 'Kicks', 'Titan'],
    '6': ['3 Series', '5 Series', 'X3', 'X5', 'M3', '7 Series', 'X1', 'X7', 'i4', 'iX'],
    '7': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'G-Class', 'CLA', 'EQS'],
    '8': ['A4', 'A6', 'Q5', 'Q7', 'e-tron', 'A3', 'Q3', 'A8', 'Q8', 'RS6'],
    '9': ['ES', 'RX', 'NX', 'LS', 'IS', 'GX', 'UX', 'LC', 'LX', 'RC'],
    '10': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq', 'Accent', 'Veloster'],
    '11': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Seltos', 'K5', 'Carnival', 'Niro'],
    '12': ['Forester', 'Outback', 'Impreza', 'Crosstrek', 'Legacy', 'Ascent', 'WRX', 'BRZ'],
    '13': ['Golf', 'Jetta', 'Tiguan', 'Atlas', 'Passat', 'ID.4', 'Taos', 'Arteon', 'GTI', 'ID.Buzz'],
    '14': ['Mazda3', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-30', 'Mazda6', 'CX-50', 'MX-30'],
    '15': ['XC90', 'XC60', 'S60', 'V60', 'XC40', 'S90', 'V90', 'C40 Recharge'],
    '16': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Grand Wagoneer', 'Wagoneer'],
    '17': ['TLX', 'RDX', 'MDX', 'Integra', 'NSX', 'ILX', 'RLX'],
    '18': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80', 'QX55'],
    '19': ['Escalade', 'CT4', 'CT5', 'XT4', 'XT5', 'XT6', 'Lyriq'],
    '20': ['Enclave', 'Encore', 'Envision', 'Regal', 'LaCrosse'],
    '21': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster'],
    '22': ['Range Rover', 'Discovery', 'Defender', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Discovery Sport'],
    '23': ['F-Pace', 'E-Pace', 'I-Pace', 'XF', 'XE', 'F-Type'],
    '24': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
    '25': ['Sierra', 'Terrain', 'Acadia', 'Yukon', 'Canyon', 'Hummer EV'],
    '26': ['Pacifica', '300', 'Voyager'],
    '27': ['Challenger', 'Charger', 'Durango', 'Journey', 'Hornet'],
    '28': ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
    '29': ['Cooper', 'Countryman', 'Clubman', 'Cooper SE'],
    '30': ['G70', 'G80', 'G90', 'GV70', 'GV80', 'GV60'],
    '31': ['Outlander', 'Eclipse Cross', 'Mirage', 'Outlander Sport', 'Outlander PHEV'],
    '32': ['Navigator', 'Aviator', 'Corsair', 'Nautilus'],
    '33': ['R1T', 'R1S', 'R2'],
    '34': ['Air', 'Gravity']
  };

  const defaultModels = ['Base', 'Standard', 'Deluxe', 'Premium'];
  const makeModels = modelsByMake[makeId] || defaultModels;

  return makeModels.map((model, index) => ({
    id: `${makeId}-${index}`,
    make_id: makeId,
    model_name: model
  }));
};
