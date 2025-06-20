
export interface FollowUpAnswers {
  vin: string;
  zip_code: string;
  mileage: number;
  condition: string;
  accidents: boolean;
  maintenance_records: boolean;
  modifications: string;
  additional_notes: string;
  [key: string]: any; // Allow additional fields
}
