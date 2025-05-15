
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-mobile';
import { DealerMessagesLayout } from '@/components/dealer-messages/DealerMessagesLayout';
import { LeadsProvider } from '@/components/dealer-messages/context/LeadsContext';
import { Toaster } from '@/components/ui/sonner';

const DealerMessagesPage: React.FC = () => {
  // Add page title for SEO
  useEffect(() => {
    document.title = "Dealer Inbox & Messages | Car Detective";
  }, []);

  return (
    <>
      <LeadsProvider>
        <DealerMessagesLayout />
      </LeadsProvider>
      <Toaster position="top-right" />
    </>
  );
};

export default DealerMessagesPage;
