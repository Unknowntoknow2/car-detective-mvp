
export interface ValuationHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export interface VehicleInfoProps {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  location?: string;
}
