
export interface PremiumServiceResponse {
  isPremium: boolean;
  features: string[];
}

export const premiumService = {
  checkPremiumStatus: async (userId: string): Promise<PremiumServiceResponse> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      isPremium: false,
      features: []
    };
  }
};
