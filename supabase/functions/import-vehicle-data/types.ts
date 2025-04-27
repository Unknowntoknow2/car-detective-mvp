
export interface Make {
  id: string;
  make_name: string;
  logo_url?: string;
  nhtsa_make_id?: number;
  country_of_origin?: string;
  description?: string;
  founding_year?: number;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: number;
}
