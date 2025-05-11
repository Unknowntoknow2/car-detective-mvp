
export interface DealerSignupData {
  email: string;
  password: string;
  dealership_name: string;
  contact_name: string;
  phone?: string;
}

export interface Dealer {
  id: string;
  dealership_name: string;
  contact_name: string;
  phone?: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}
