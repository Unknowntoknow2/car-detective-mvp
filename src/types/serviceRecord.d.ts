
export interface ServiceRecord {
  id: string;
  vin: string;
  service_date: string;
  mileage: number;
  description: string;
  receipt_url?: string;
  created_at: string;
}
