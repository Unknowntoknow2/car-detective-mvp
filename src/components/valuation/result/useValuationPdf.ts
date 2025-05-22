
import { useState } from 'react';
import { generateValuationPdf, downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData, ReportOptions } from '@/utils/pdf/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseValuationPdfProps {
  valuationId?: string;
  valuationData?: any;
  conditionData?: any;
}

export function useValuationPdf({ 
  valuationId, 
  valuationData, 
  conditionData 
}: UseValuationPdfProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const prepareReportData = (isPremium: boolean = false): ReportData => {
    // Convert from valuation data format to PDF report data format
    if (valuationData) {
      return {
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        condition: valuationData.condition,
        estimatedValue: valuationData.estimatedValue || valuationData.estimated_value,
        confidenceScore: valuationData.confidenceScore || valuationData.confidence_score,
        vin: valuationData.vin,
        zipCode: valuationData.zipCode || valuationData.zip_code,
        adjustments: valuationData.adjustments || [],
        generatedAt: valuationData.created_at || new Date().toISOString(),
        fuelType: valuationData.fuelType || valuationData.fuel_type,
        transmission: valuationData.transmission,
        photoUrl: valuationData.photoUrl || valuationData.photo_url,
      };
    }
    
    // Default empty report data if no valuation data available
    return {
      make: 'Unknown',
      model: 'Unknown',
      year: new Date().getFullYear(),
      mileage: 0,
      condition: 'Unknown',
      estimatedValue: 0,
      confidenceScore: 0,
      adjustments: [],
      generatedAt: new Date().toISOString()
    };
  };
  
  const generatePdf = async ({ isPremium = false }: { isPremium?: boolean } = {}) => {
    setIsGenerating(true);
    
    try {
      // Prepare report data
      const reportData = prepareReportData(isPremium);
      
      // Include condition data if available
      if (conditionData) {
        reportData.aiCondition = {
          condition: conditionData.condition || 'Good',
          confidenceScore: conditionData.confidence_score || 80,
          issuesDetected: conditionData.issues_detected || [],
          summary: conditionData.summary || 'No detailed condition assessment available.'
        };
      }
      
      // Set report options
      const reportOptions: Partial<ReportOptions> = {
        showPremiumWatermark: isPremium,
        includeExplanation: isPremium,
        includeComparables: isPremium,
        includeBranding: true,
        includePhotoAssessment: true
      };
      
      // Generate PDF
      const pdfBytes = await generateValuationPdf(reportData, reportOptions);
      
      // Create a blob and URL
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      // If not premium, show the PDF in a new tab
      if (!isPremium) {
        window.open(url, '_blank');
      } else {
        // For premium, download the PDF
        const fileName = `${reportData.make}_${reportData.model}_${reportData.year}_Valuation.pdf`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('PDF generated successfully');
      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadSamplePdf = async () => {
    setIsGenerating(true);
    
    try {
      // Create sample data for demo purposes
      const sampleData: ReportData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 45000,
        condition: 'Good',
        estimatedValue: 18500,
        confidenceScore: 85,
        zipCode: '90210',
        adjustments: [
          { factor: 'Mileage', impact: -500, description: 'Lower than average mileage' },
          { factor: 'Condition', impact: 1200, description: 'Vehicle in good condition' },
          { factor: 'Market Demand', impact: 300, description: 'High demand in local market' }
        ],
        generatedAt: new Date().toISOString(),
        aiCondition: {
          condition: 'Good',
          confidenceScore: 85,
          issuesDetected: [],
          summary: 'The vehicle appears to be in good condition with normal wear for its age.'
        }
      };
      
      // Set sample options
      const options: Partial<ReportOptions> = {
        watermarkText: 'SAMPLE REPORT',
        showPremiumWatermark: true,
        includeExplanation: true,
        includeComparables: true,
        includeBranding: true,
        includePhotoAssessment: false
      };
      
      // Generate the sample PDF
      const pdfBytes = await generateValuationPdf(sampleData, options);
      
      // Create a blob and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const fileName = `Car_Detective_Sample_Report.pdf`;
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Sample PDF downloaded');
      return url;
    } catch (error) {
      console.error('Error generating sample PDF:', error);
      toast.error('Failed to generate sample PDF');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const emailPdf = async () => {
    if (!valuationId) {
      toast.error('Valuation ID is required');
      return;
    }
    
    setIsEmailSending(true);
    
    try {
      // Generate the PDF if not already generated
      let url = pdfUrl;
      if (!url) {
        url = await generatePdf({ isPremium: true });
        if (!url) throw new Error('Failed to generate PDF');
      }
      
      // Get user info for email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to send emails');
        return;
      }
      
      // Prepare condition data for email if available
      let conditionInfo = null;
      if (conditionData) {
        conditionInfo = {
          condition: conditionData.condition,
          confidenceScore: conditionData.confidence_score,
          summary: conditionData.summary
        };
      }
      
      // Call email API endpoint (this would be implemented separately)
      const { error } = await supabase.functions.invoke('email-valuation-pdf', {
        body: {
          valuationId,
          userId: user.id,
          email: user.email,
          conditionInfo
        }
      });
      
      if (error) throw error;
      
      toast.success('PDF sent to your email');
    } catch (error) {
      console.error('Error emailing PDF:', error);
      toast.error('Failed to send PDF via email');
    } finally {
      setIsEmailSending(false);
    }
  };
  
  return {
    generatePdf,
    downloadSamplePdf,
    emailPdf,
    isGenerating,
    isEmailSending,
    pdfUrl
  };
}
