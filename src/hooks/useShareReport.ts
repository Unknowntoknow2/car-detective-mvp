
import { useState } from 'react';

export const useShareReport = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareReport = async (valuationId: string, email?: string) => {
    if (!valuationId) {
      setError('No valuation ID provided');
      return false;
    }

    try {
      setIsSharing(true);
      setError(null);
      
      if (email) {
        console.log(`Sharing report ${valuationId} to ${email}`);
      } else if (navigator.share) {
        await navigator.share({
          title: 'Vehicle Valuation Report',
          text: 'Check out my vehicle valuation report!',
          url: `${window.location.origin}/report/${valuationId}`
        });
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/report/${valuationId}`);
        console.log('Report link copied to clipboard');
      }
      
      return true;
    } catch (err) {
      console.error('Error sharing report:', err);
      setError('Failed to share report');
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  // Add shareViaEmail method to match the expected interface
  const shareViaEmail = async (valuationId: string, email?: string) => {
    return shareReport(valuationId, email);
  };

  return {
    shareReport,
    shareViaEmail,
    isSharing,
    error
  };
};

export default useShareReport;
