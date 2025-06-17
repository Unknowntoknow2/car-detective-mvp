
export interface Referral {
  id: string;
  inviter_id: string;
  referred_user_id?: string;
  referral_token: string;
  reward_status: 'pending' | 'earned' | 'claimed';
  reward_type?: string;
  reward_amount?: number;
  created_at: string;
  updated_at: string;
}
