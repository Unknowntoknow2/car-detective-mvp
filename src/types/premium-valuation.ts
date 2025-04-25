
export type FeatureOption = {
  id: string;
  name: string;
  icon: string;
  value: number;
};

export type FormData = {
  identifierType: 'vin' | 'plate';
  identifier: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  fuelType: string | null;
  features: string[];
  condition: number;
  conditionLabel: string;
  hasAccident: boolean;
  accidentDescription: string;
  zipCode: string;
};
