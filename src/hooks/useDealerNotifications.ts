
import { useState } from 'react';
import { notifyDealersOfNewValuation } from '@/lib/notifications/DealerNotification';
import { ReportData } from '@/utils/pdf/types';

export function useDealerNotifications() {
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const triggerDealerNotifications = async (
    valuationData: ReportData,
    zipCode: string
  ) => {
    setIsNotifying(true);
    setNotificationStatus(null);

    try {
      await notifyDealersOfNewValuation(valuationData, zipCode);
      setNotificationStatus({
        success: true,
        message: 'Dealers have been notified successfully'
      });
    } catch (error) {
      console.error('Failed to notify dealers:', error);
      setNotificationStatus({
        success: false,
        message: 'Failed to notify dealers'
      });
    } finally {
      setIsNotifying(false);
    }
  };

  return {
    isNotifying,
    notificationStatus,
    triggerDealerNotifications
  };
}
