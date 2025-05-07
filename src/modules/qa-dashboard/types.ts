
export interface Valuation {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zip_code: string;
  estimated_value: number;
  confidence_score: number;
  status: 'pending' | 'completed' | 'error';
  error_message?: string;
  is_premium: boolean;
  paid_at?: string;
  stripe_session_id?: string;
}

export interface ValuationRowProps {
  valuation: Valuation;
  onViewResult: (id: string) => void;
  onRerunGPT: (id: string) => void;
  onGeneratePDF: (id: string) => void;
  onDownloadPDF: (id: string) => void;
  onViewStripeStatus: (id: string) => void;
}

export interface ValuationFilter {
  status?: 'all' | 'pending' | 'completed' | 'error';
  dateRange?: [Date | null, Date | null];
  premium?: boolean;
  search?: string;
}

export interface DateRangeOption {
  label: string;
  value: string;
  range: [Date | null, Date | null];
}
