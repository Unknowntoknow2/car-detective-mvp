import React, { useState, useEffect } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Shield } from "lucide-react";

interface CarfaxReportTabProps {
  vin?: string;
}

export function CarfaxReportTab({ vin }: CarfaxReportTabProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (vin) {
      setIsLoading(true);
      // Simulate fetching CARFAX report
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [vin]);

  const downloadReport = () => {
  };

  if (!vin) {
    return (
      <TabContentWrapper
        title="CARFAX® Vehicle History Report"
        description="Enter a VIN to access the complete vehicle history report"
      >
        <div className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            VIN required for CARFAX® report access
          </p>
        </div>
      </TabContentWrapper>
    );
  }

  if (isLoading) {
    return (
      <TabContentWrapper
        title="CARFAX® Vehicle History Report"
        description="Fetching comprehensive vehicle history data"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </TabContentWrapper>
    );
  }

  return (
    <TabContentWrapper
      title="CARFAX® Vehicle History Report"
      description="Complete vehicle history and damage assessment"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Vehicle History Summary</h3>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download Full Report
          </Button>
        </div>

        {/* Report Content (Placeholder) */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            CARFAX® report data will be displayed here.
          </p>
        </div>
      </div>
    </TabContentWrapper>
  );
}
