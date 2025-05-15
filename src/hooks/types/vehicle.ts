
export interface Make {
  id: string;
  make_name: string;
  logo_url?: string | null;
  country_of_origin?: string | null;
  nhtsa_make_id?: number | null;
  popular?: boolean;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: string | null;
  popular: boolean;
}
