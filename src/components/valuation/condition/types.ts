
export interface ConditionValues {
  exteriorBody: string | number;
  exteriorPaint: string | number;
  interiorSeats: string | number;
  interiorDashboard: string | number;
  mechanicalEngine: string | number;
  mechanicalTransmission: string | number;
  tiresCondition?: string | number;
  odometer?: number;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  zipCode?: string;
}
