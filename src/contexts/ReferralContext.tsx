
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Referral {
  id: string;
  inviter_id: string;
  referred_email?: string;
  referred_user_id?: string;
  referral_token: string;
  reward_status: 'pending' | 'earned' | 'claimed';
  created_at: string;
  updated_at: string;
  reward_type?: string;
  reward_amount?: number;
}

export interface ReferralStats {
  total_referrals: number;
  pending_referrals: number;
  earned_rewards: number;
  claimed_rewards: number;
}

interface ReferralContextType {
  loading: boolean;
  myReferralToken: string | null;
  myReferrals: Referral[];
  referralStats: ReferralStats | null;
  loadMyReferrals: () => Promise<void>;
  generateReferralLink: (email?: string) => Promise<string>;
  checkForReferral: () => void;
  claimReward: (referralId: string) => Promise<boolean>;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myReferralToken, setMyReferralToken] = useState<string | null>(null);
  const [myReferrals, setMyReferrals] = useState<Referral[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);

  // Check for referral token in URL on mount
  useEffect(() => {
    checkForReferral();
  }, []);

  // Load user's referrals when authenticated
  useEffect(() => {
    if (user) {
      loadMyReferrals();
    } else {
      setMyReferrals([]);
      setMyReferralToken(null);
      setReferralStats(null);
    }
  }, [user]);

  const checkForReferral = () => {
    // Check URL for referral token
    const urlParams = new URLSearchParams(window.location.search);
    const referralToken = urlParams.get('ref');
    
    if (referralToken) {
      // Store the token in localStorage to use during signup
      localStorage.setItem('referralToken', referralToken);
      console.log('Referral token found:', referralToken);
    }
  };

  const loadMyReferrals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user's referrals
      const { data: referralsData, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert string reward_status to the correct type
      const typedReferrals: Referral[] = (referralsData || []).map(ref => ({
        ...ref,
        reward_status: ref.reward_status as 'pending' | 'earned' | 'claimed'
      }));
      
      setMyReferrals(typedReferrals);
      
      // Get existing token or create a new one
      if (typedReferrals.length > 0) {
        // Find the most recent valid token
        const latestReferral = typedReferrals.find(r => !r.referred_user_id);
        if (latestReferral) {
          setMyReferralToken(latestReferral.referral_token);
        } else {
          // Generate a new token if all are used
          const newToken = await generateReferralLink();
          setMyReferralToken(newToken);
        }
      } else {
        // Generate a first token
        const newToken = await generateReferralLink();
        setMyReferralToken(newToken);
      }
      
      // Get referral stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_referral_stats', { user_id: user.id });
        
      if (statsError) throw statsError;
      
      if (statsData && Array.isArray(statsData) && statsData.length > 0) {
        // Fix for the type error - extract the first item from the array
        setReferralStats(statsData[0] as ReferralStats);
      }
    } catch (error) {
      console.error('Error loading referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = async (email?: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('process-referral', {
        body: { 
          action: 'generate',
          referredEmail: email
        }
      });
      
      if (error) throw error;
      
      // Refresh the referrals list
      await loadMyReferrals();
      
      return data.referralToken;
    } catch (error) {
      console.error('Error generating referral link:', error);
      toast.error('Failed to generate referral link');
      throw error;
    }
  };

  const claimReward = async (referralId: string): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('process-referral', {
        body: { 
          action: 'claim',
          referralId
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('Reward claimed successfully!');
        // Refresh referrals
        await loadMyReferrals();
        return true;
      } else {
        toast.error(data.message || 'Failed to claim reward');
        return false;
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
      return false;
    }
  };

  return (
    <ReferralContext.Provider
      value={{
        loading,
        myReferralToken,
        myReferrals,
        referralStats,
        loadMyReferrals,
        generateReferralLink,
        checkForReferral,
        claimReward,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferrals = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferrals must be used within a ReferralProvider');
  }
  return context;
};
