
// Define the structure of condition categories and items
export type ConditionItem = {
  id: string;
  name: string;
  category: string;
};

// Exterior condition items
export const exteriorCategories: ConditionItem[] = [
  { id: 'exterior-paint', name: 'Paint & Finish', category: 'exterior' },
  { id: 'exterior-body', name: 'Body Panels', category: 'exterior' },
  { id: 'exterior-glass', name: 'Glass & Mirrors', category: 'exterior' },
  { id: 'exterior-lights', name: 'Lights & Signals', category: 'exterior' },
  { id: 'exterior-trim', name: 'Exterior Trim', category: 'exterior' },
];

// Interior condition items
export const interiorCategories: ConditionItem[] = [
  { id: 'interior-seats', name: 'Seats & Upholstery', category: 'interior' },
  { id: 'interior-dash', name: 'Dashboard & Controls', category: 'interior' },
  { id: 'interior-carpet', name: 'Carpet & Floor Mats', category: 'interior' },
  { id: 'interior-headliner', name: 'Headliner & Trim', category: 'interior' },
  { id: 'interior-electronics', name: 'Electronics & Infotainment', category: 'interior' },
];

// Mechanical condition items
export const mechanicalCategories: ConditionItem[] = [
  { id: 'mechanical-engine', name: 'Engine Performance', category: 'mechanical' },
  { id: 'mechanical-transmission', name: 'Transmission', category: 'mechanical' },
  { id: 'mechanical-suspension', name: 'Suspension & Steering', category: 'mechanical' },
  { id: 'mechanical-brakes', name: 'Brakes & Brake Pads', category: 'mechanical' },
  { id: 'mechanical-electrical', name: 'Electrical System', category: 'mechanical' },
];

// Tires & wheels condition items
export const tiresCategories: ConditionItem[] = [
  { id: 'tires-tread', name: 'Tire Tread Depth', category: 'tires' },
  { id: 'tires-wheels', name: 'Wheel Condition', category: 'tires' },
  { id: 'tires-matching', name: 'Matching Tires', category: 'tires' },
];

// Combined categories for easy access
export const allCategories = [
  ...exteriorCategories,
  ...interiorCategories,
  ...mechanicalCategories,
  ...tiresCategories,
];

// Category display names and descriptions
export const categoryMetadata = {
  exterior: {
    title: 'Exterior Condition',
    description: 'Body, paint, glass, and trim',
  },
  interior: {
    title: 'Interior Condition',
    description: 'Seats, dashboard, carpet, and controls',
  },
  mechanical: {
    title: 'Mechanical Condition',
    description: 'Engine, transmission, brakes, and electrical',
  },
  tires: {
    title: 'Tires & Wheels',
    description: 'Tread depth, wheel condition, and alignment',
  },
};
