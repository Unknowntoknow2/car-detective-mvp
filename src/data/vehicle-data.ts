
// Fallback vehicle data for when API calls fail

export const VEHICLE_MAKES = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", 
  "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", 
  "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", 
  "Lexus", "Lincoln", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MINI", "Mitsubishi", 
  "Nissan", "Porsche", "RAM", "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

export const VEHICLE_MODELS = [
  "Accord", "Altima", "Aventador", "Bronco", "Camaro", "Camry", "Charger", "Civic", "Colorado", 
  "Corolla", "Corvette", "CR-V", "Cruze", "Durango", "Edge", "Encore", "Equinox", "Escape", 
  "Explorer", "F-150", "Fiesta", "Focus", "Fusion", "G-Class", "Highlander", "Impala", "Jetta", 
  "Malibu", "Maxima", "Model 3", "Model S", "Model X", "Model Y", "Mustang", "Odyssey", "Outback", 
  "Pacifica", "Pilot", "Prius", "RAV4", "Rio", "Rogue", "Sentra", "Silverado", "Sonata", 
  "Soul", "Tacoma", "Tahoe", "Taurus", "Tiguan", "Tucson", "Tundra", "Wrangler", "X5", "XC90"
];

// Define a type for the vehicle models by make object
export interface VehicleModelsByMake {
  [make: string]: string[];
}

export const VEHICLE_MODELS_BY_MAKE: VehicleModelsByMake = {
  "Acura": ["ILX", "MDX", "NSX", "RDX", "TLX", "TSX"],
  "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "R8", "TT"],
  "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4"],
  "Chevrolet": ["Blazer", "Camaro", "Colorado", "Corvette", "Equinox", "Malibu", "Silverado", "Suburban", "Tahoe", "Traverse"],
  "Ford": ["Bronco", "Edge", "Escape", "Explorer", "F-150", "Fusion", "Mustang", "Ranger"],
  "Honda": ["Accord", "Civic", "CR-V", "Fit", "HR-V", "Odyssey", "Pilot", "Ridgeline"],
  "Hyundai": ["Accent", "Elantra", "Kona", "Palisade", "Santa Fe", "Sonata", "Tucson", "Veloster"],
  "Lexus": ["ES", "GS", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "UX"],
  "Mercedes-Benz": ["A-Class", "C-Class", "CLA", "CLS", "E-Class", "G-Class", "GLA", "GLC", "GLE", "GLS", "S-Class", "SL"],
  "Nissan": ["Altima", "Armada", "Frontier", "GT-R", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Toyota": ["4Runner", "Avalon", "Camry", "Corolla", "Highlander", "Land Cruiser", "Prius", "RAV4", "Sienna", "Tacoma", "Tundra"]
};
