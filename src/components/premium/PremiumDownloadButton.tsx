
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Lock } from 'lucide-react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { downloadPdf, ReportData, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';

interface PremiumDownloadButtonProps {
  valuationId: string;
  vehicleInfo: any;
  valuationData: any;
  children?: React.ReactNode;
}

export function PremiumDownloadButton({ 
  valuationId, 
  vehicleInfo, 
  valuationData,
  children 
}: PremiumDownloadButtonProps) {
  const { isPremiumUnlocked, isLoading, unlockPremium } = usePremiumStatus(valuationId);
  
  const handleDownload = async () => {
    if (!isPremiumUnlocked) {
      toast.info("You need to unlock premium access for this report.");
      await unlockPremium(valuationId);
      return;
    }
    
    try {
      // Prepare report data
      const reportData = convertVehicleInfoToReportData(vehicleInfo, valuationData);
      
      // Set as premium report
      reportData.isPremium = true;
      
      // Download the PDF
      await downloadPdf(reportData);
      toast.success("Premium report downloaded successfully!");
    } catch (error) {
      console.error('Error downloading premium report:', error);
      toast.error('Failed to download premium report');
    }
  };
  
  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant={isPremiumUnlocked ? "default" : "outline"}
      className={isPremiumUnlocked ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {isLoading ? (
        "Loading..."
      ) : isPremiumUnlocked ? (
        <>
          <Download className="mr-2 h-4 w-4" />
          {children || "Download Premium Report"}
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          {children || "Unlock Premium Report"}
        </>
      )}
    </Button>
  );
}
