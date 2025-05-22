
import { useState, useEffect } from 'react';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

interface FeatureFlags {
  premiumTools: boolean;
  vinLookup: boolean;
  aiAssistant: boolean;
  pdfPreview: boolean;
  marketAnalysis: boolean;
  photoUpload: boolean;
  dealerOffers: boolean;
  drivingBehavior: boolean;
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>({
    premiumTools: true,
    vinLookup: true,
    aiAssistant: true,
    pdfPreview: true,
    marketAnalysis: true,
    photoUpload: true,
    dealerOffers: true,
    drivingBehavior: true,
  });

  // In a real app, this would fetch flags from an API or localStorage
  useEffect(() => {
    // Force all features to be enabled in development mode if SHOW_ALL_COMPONENTS is true
    if (SHOW_ALL_COMPONENTS) {
      setFlags({
        premiumTools: true,
        vinLookup: true,
        aiAssistant: true,
        pdfPreview: true,
        marketAnalysis: true,
        photoUpload: true,
        dealerOffers: true,
        drivingBehavior: true,
      });
    }
  }, []);

  return flags;
}
