
export interface NicbRecord {
  status: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  statusDate: string;
  // Add more fields as needed based on actual API response
}

export interface NicbData {
  records: NicbRecord[];
  // Add more fields as needed based on actual API response
}

export interface NicbResponse {
  data: NicbData;
  source: 'api' | 'cache';
  fetched_at: string;
}

export interface NicbError {
  error: string;
}
