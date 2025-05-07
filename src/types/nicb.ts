
// Define the NicbData type for the NICB VIN check
export interface NicbData {
  vin: string;
  is_stolen: boolean;
  is_recovered: boolean;
  has_title_issues: boolean;
  theft_date?: string;
  recovery_date?: string;
  last_checked?: string;
  records?: any[];
}

// Define the response types for the NICB API
export interface NicbResponse {
  data: NicbData;
  source: 'api' | 'cache';
  fetched_at: string;
}

export interface NicbError {
  error: string;
}
