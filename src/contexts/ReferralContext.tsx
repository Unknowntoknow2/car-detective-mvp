
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
