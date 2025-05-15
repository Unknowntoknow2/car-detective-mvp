
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { ReportData } from '@/utils/pdf/types';
import { generateValuationPdf, downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { useAuth } from '@/hooks/useAuth';

interface DownloadPDFButtonProps {
  valuationId: string;
  isPremium?: boolean;
  onDownload?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  // Data can be provided directly if already available
  valuationData?: Partial<ReportData>;
}

export function DownloadPDFButton({
  valuationId,
  isPremium = false,
  onDownload,
  className,
  variant = 'outline',
  size = 'default',
  disabled = false,
  valuationData
}: DownloadPDFButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      toast({
        description: "Please log in to download the valuation report.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // If we already have the valuation data, use it directly
      if (valuationData && Object.keys(valuationData).length > 0) {
        const reportData: ReportData = {
          id: valuationId,
          make: valuationData.make || 'Unknown',
          model: valuationData.model || 'Vehicle',
          year: valuationData.year || new Date().getFullYear(),
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || 'Good',
          zipCode: valuationData.zipCode || '00000',
          estimatedValue: valuationData.estimatedValue || 0,
          confidenceScore: valuationData.confidenceScore,
          priceRange: valuationData.priceRange,
          generatedAt: new Date().toISOString(),
          userId: user.id,
          isPremium: isPremium,
          aiCondition: valuationData.aiCondition,
          adjustments: valuationData.adjustments,
          explanation: valuationData.explanation,
          vin: valuationData.vin
        };

        await downloadValuationPdf(reportData);
      } else {
        // Fetch data from the server and generate PDF
        const response = await fetch(
          `https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/generate-valuation-pdf`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`
            },
            body: JSON.stringify({
              valuationId,
              userId: user.id
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate PDF');
        }

        const data = await response.json();

        // If we got a URL, open it directly
        if (data.url) {
          // Open in a new tab or trigger download directly
          window.open(data.url, '_blank');
        } else {
          throw new Error('No PDF URL returned from server');
        }
      }

      if (onDownload) onDownload();
      
      toast({
        description: "Your valuation report has been downloaded successfully."
      });
    } catch (error: any) {
      console.error('Download failed:', error);
      toast({
        description: error.message || "Failed to download PDF report",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For non-premium users accessing premium content
  const handlePremiumPrompt = () => {
    toast({
      description: "Upgrade to premium to download full reports with enhanced insights.",
      variant: "default"
    });
    // Here you would add navigation to premium upgrade page
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={isPremium ? handleDownload : handlePremiumPrompt}
      disabled={isLoading || disabled}
      className={cn("gap-2", className)}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isPremium ? "Download Report" : "Upgrade for Full Report"}
    </Button>
  );
}

export default DownloadPDFButton;
