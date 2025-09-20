
import React, { useEffect } from "react";
import { DealerMessagesLayout } from "@/components/dealer-messages/DealerMessagesLayout";
import { LeadsProvider } from "@/components/dealer-messages/context/LeadsContext";
import { Toaster } from "@/components/ui/sonner";

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
      <Toaster />
    </>
  );
};

export default DealerMessagesPage;
