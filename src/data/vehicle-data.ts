
export const VEHICLE_MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", 
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia", 
  "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mitsubishi", 
  "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

export const VEHICLE_MODELS: Record<string, string[]> = {
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Odyssey", "Fit", "HR-V", "Passport", "Ridgeline"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Sienna", "Tacoma", "Tundra", "4Runner"],
  "Ford": ["F-150", "Escape", "Explorer", "Focus", "Mustang", "Edge", "Expedition", "Ranger", "Bronco"],
  "Chevrolet": ["Silverado", "Equinox", "Malibu", "Tahoe", "Suburban", "Traverse", "Camaro", "Corvette"],
  "BMW": ["3 Series", "5 Series", "X3", "X5", "X1", "7 Series", "4 Series", "X7", "Z4"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS", "A-Class", "CLA", "G-Class"],
  "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3", "A8", "TT", "R8"],
  "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano", "Maxima", "Titan", "Frontier", "370Z"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "Genesis", "Palisade", "Kona", "Veloster"],
  "Kia": ["Optima", "Forte", "Sorento", "Sportage", "Soul", "Stinger", "Telluride", "Rio", "Cadenza"],
  "Subaru": ["Outback", "Forester", "Impreza", "Legacy", "Crosstrek", "Ascent", "WRX", "BRZ"],
  "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-3", "MX-5 Miata", "CX-30"],
  "Volkswagen": ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Beetle", "Arteon"],
  "Jeep": ["Grand Cherokee", "Cherokee", "Wrangler", "Compass", "Renegade", "Gladiator"],
  "Ram": ["1500", "2500", "3500", "ProMaster"],
  "GMC": ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon"],
  "Buick": ["Enclave", "Encore", "Envision", "LaCrosse"],
  "Cadillac": ["Escalade", "XT5", "CT6", "XT4", "CTS"],
  "Lincoln": ["Navigator", "MKX", "MKZ", "Continental"],
  "Acura": ["MDX", "RDX", "TLX", "ILX", "NSX"],
  "Infiniti": ["QX60", "Q50", "QX80", "Q60", "QX50"],
  "Lexus": ["RX", "ES", "GX", "LX", "IS", "LS", "NX"],
  "Volvo": ["XC90", "XC60", "S60", "V60", "XC40"],
  "Land Rover": ["Range Rover", "Discovery", "Evoque", "Velar"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Boxster"],
  "Tesla": ["Model S", "Model 3", "Model X", "Model Y"],
  "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage", "Outlander Sport"],
  "Chrysler": ["Pacifica", "300"],
  "Dodge": ["Charger", "Challenger", "Durango", "Journey"]
};

export const getModelsForMake = (make: string): string[] => {
  return VEHICLE_MODELS[make] || [];
};

export const CURRENT_YEAR = new Date().getFullYear();
export const VEHICLE_YEARS = Array.from(
  { length: 30 }, 
  (_, i) => CURRENT_YEAR - i
);

export const CONDITION_OPTIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];
