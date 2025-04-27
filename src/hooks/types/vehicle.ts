
export interface Make {
  id: string;
  make_name: string;
  logo_url?: string | null;
  nhtsa_make_id?: number | null;
  country_of_origin?: string | null;
  description?: string | null;
  founding_year?: number | null;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: number | null;
}

export interface ModelsByMake {
  [key: string]: Model[];
}

export interface VehicleDataHook {
  makes: Make[];
  models: Model[];
  modelsByMake: Record<string, Model[]>;
  getModelsByMake: (makeName: string) => Model[];
  getYearOptions: (startYear?: number) => number[];
  isLoading: boolean;
  error: string | null;
  refreshData: (forceRefresh?: boolean) => Promise<any>;
  counts: {
    makes: number;
    models: number;
  };
}
