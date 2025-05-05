
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateValuationPdf } from './pdfGeneratorService';

export interface ReportData {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  color: string;
  bodyStyle: string;
  bodyType: string;
  fuelType: string;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  isPremium: boolean;
  valuationId?: string;
}

export const convertVehicleInfoToReportData = (vehicleInfo: any, valuationData: any): ReportData => {
  return {
    vin: vehicleInfo.vin || 'Unknown',
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: typeof vehicleInfo.mileage === 'number' ? vehicleInfo.mileage.toString() : vehicleInfo.mileage || '0',
    condition: valuationData.condition || vehicleInfo.condition || 'Not Specified',
    zipCode: vehicleInfo.zipCode || valuationData.zipCode || '',
    estimatedValue: valuationData.estimatedValue || 0,
    confidenceScore: valuationData.confidenceScore || 80,
    color: vehicleInfo.color || 'Not Specified',
    bodyStyle: vehicleInfo.bodyType || 'Not Specified',
    bodyType: vehicleInfo.bodyType || 'Not Specified',
    fuelType: vehicleInfo.fuelType || 'Not Specified',
    aiCondition: valuationData.aiConditionData || null,
    isPremium: false,
    valuationId: vehicleInfo.valuationId
  };
};

export const downloadPdf = async (reportData: ReportData): Promise<void> => {
  try {
    // Check if this is a premium report and if user has purchased access
    let isPremiumUnlocked = false;
    
    if (reportData.valuationId) {
      const { data: valuation, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', reportData.valuationId)
        .single();
        
      if (error) {
        console.error('Error checking premium status:', error);
      } else {
        // Using type assertion to safely access premium_unlocked
        type ValuationWithPremium = typeof valuation & { premium_unlocked?: boolean };
        const valuationData = valuation as ValuationWithPremium;
        
        isPremiumUnlocked = !!valuationData.premium_unlocked;
      }
    }
    
    // If this is a premium report but not unlocked, redirect to purchase
    if (reportData.isPremium && !isPremiumUnlocked) {
      toast.error('This is a premium report. Please purchase to download.');
      // Redirect to premium purchase page
      window.location.href = '/premium?valuationId=' + reportData.valuationId;
      return;
    }
    
    // Generate the PDF
    let pdfBytes;
    
    if (reportData.isPremium) {
      // Generate premium report with additional features
      // (This will be implemented in pdfGeneratorService.ts)
      pdfBytes = await generateValuationPdf({
        ...reportData, 
        isPremium: true
      });
    } else {
      // Generate basic report
      pdfBytes = await generateValuationPdf(reportData);
    }
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportData.year}_${reportData.make}_${reportData.model}_valuation.pdf`;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Click the link
    link.click();
    
    // Remove the link
    document.body.removeChild(link);
    
    // Log success
    console.log('PDF downloaded successfully');
    toast.success('PDF report downloaded successfully');
    
  } catch (err) {
    console.error('Error downloading PDF:', err);
    toast.error('Failed to download PDF report');
  }
};
