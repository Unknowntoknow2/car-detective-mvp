
export interface SectionParams {
  page: any;
  margin: number;
  contentWidth: number;
  boldFont: string;
  regularFont: string;
  primaryColor: string;
  textColor: string;
  height?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ReportData {
  // Base fields
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  price: number;
  condition: string;
  
  // Additional fields
  features?: string[];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  explanation?: string;
  createdAt?: string;
  generatedAt?: string;
}
