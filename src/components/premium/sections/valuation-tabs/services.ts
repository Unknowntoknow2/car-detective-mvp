
export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'photo' | 'dealers' | 'market' | 'forecast' | 'carfax';

export interface ValuationService {
  id: ValuationServiceId;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isPremium?: boolean;
  disabled?: boolean;
}
