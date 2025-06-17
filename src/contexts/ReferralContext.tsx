
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

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

interface ReferralContextType {
  referralCode: string | null;
  generateReferralCode: () => Promise<string>;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const generateReferralCode = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    // Mock referral code generation
    return `REF_${user.id.slice(0, 8)}`;
  };

  return (
    <ReferralContext.Provider value={{
      referralCode: user ? `REF_${user.id.slice(0, 8)}` : null,
      generateReferralCode
    }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within ReferralProvider');
  }
  return context;
};
