
export const VEHICLE_MAKES = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick',
  'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
  'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
  'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda',
  'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Porsche',
  'Ram', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const VEHICLE_MODELS = [
  // Acura
  'ILX', 'MDX', 'NSX', 'RDX', 'RLX', 'TLX', 'Integra',
  // Audi
  'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron', 'Q3', 'Q5', 'Q7', 'Q8', 'R8', 'RS', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'TT',
  // BMW
  '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'i3', 'i8', 'M2', 'M3', 'M4', 'M5', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4',
  // Chevrolet
  'Blazer', 'Bolt', 'Camaro', 'Colorado', 'Corvette', 'Equinox', 'Impala', 'Malibu', 'Silverado', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Trax',
  // Ford
  'Bronco', 'EcoSport', 'Edge', 'Escape', 'Expedition', 'Explorer', 'F-150', 'F-250', 'F-350', 'Fusion', 'Mustang', 'Ranger', 'Transit',
  // Honda
  'Accord', 'Civic', 'CR-V', 'Fit', 'HR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline',
  // Toyota
  'Avalon', 'Camry', 'Corolla', 'GR86', 'Highlander', 'Land Cruiser', 'Prius', 'RAV4', 'Sequoia', 'Sienna', 'Tacoma', 'Tundra', '4Runner'
];

export const VEHICLE_YEARS = Array.from({ length: new Date().getFullYear() - 1990 + 2 }, (_, i) => new Date().getFullYear() - i + 1).reverse();
