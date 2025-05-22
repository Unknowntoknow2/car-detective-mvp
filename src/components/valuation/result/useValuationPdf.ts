
import { useState } from 'react';
import { downloadPdf } from '@/utils/pdf';
import { ReportData } from '@/utils/pdf';
import { toast } from 'sonner';

interface UseValuationPdfProps {
  valuationId?: string;
  valuationData: any;
  conditionData: any;
}

export function useValuationPdf({ valuationId, valuationData, conditionData }: UseValuationPdfProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePdf = async ({ isPremium = false } = {}) => {
    try {
      if (!valuationData) {
        toast.error('No valuation data available');
        return null;
      }
      
      setIsGenerating(true);
      
      // Format report data
      const reportData: ReportData = {
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        condition: valuationData.condition,
        estimatedValue: valuationData.estimatedValue,
        confidenceScore: valuationData.confidenceScore || 0,
        vin: valuationData.vin,
        zipCode: valuationData.zipCode || valuationData.zip_code,
        isPremium: isPremium,
        adjustments: valuationData.adjustments || [],
        generatedAt: new Date().toISOString(),
        priceRange: [0, 0] // Will be replaced below
      };
      
      // Handle priceRange conversion - ensure it's always a tuple format
      if (valuationData.priceRange) {
        if (Array.isArray(valuationData.priceRange)) {
          reportData.priceRange = [
            Number(valuationData.priceRange[0]), 
            Number(valuationData.priceRange[1])
          ];
        } else if (typeof valuationData.priceRange === 'object') {
          const priceObj = valuationData.priceRange as any;
          // Convert from object format to tuple format if needed
          if ('min' in priceObj && 'max' in priceObj) {
            reportData.priceRange = [
              Number(priceObj.min),
              Number(priceObj.max)
            ];
          } else if ('low' in priceObj && 'high' in priceObj) {
            reportData.priceRange = [
              Number(priceObj.low),
              Number(priceObj.high)
            ];
          } else {
            // Fallback if the format is unexpected
            reportData.priceRange = [
              Math.floor(reportData.estimatedValue * 0.95),
              Math.ceil(reportData.estimatedValue * 1.05)
            ];
          }
        } else {
          // If no price range provided or it's in an invalid format, calculate one based on estimated value
          reportData.priceRange = [
            Math.floor(reportData.estimatedValue * 0.95),
            Math.ceil(reportData.estimatedValue * 1.05)
          ];
        }
      } else {
        // If no price range provided, calculate one based on estimated value
        reportData.priceRange = [
          Math.floor(reportData.estimatedValue * 0.95),
          Math.ceil(reportData.estimatedValue * 1.05)
        ];
      }
      
      // Add condition data if available
      if (conditionData) {
        reportData.aiCondition = {
          condition: conditionData.condition || reportData.condition,
          confidenceScore: conditionData.confidenceScore || reportData.confidenceScore,
          issuesDetected: conditionData.issuesDetected || [],
          summary: conditionData.summary || `Vehicle is in ${reportData.condition} condition.`
        };
      }
      
      // Pass the reportData to the downloadPdf function
      await downloadPdf(reportData);
      
      toast.success('Valuation report downloaded successfully');
      return 'success';
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate valuation report');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const emailPdf = async () => {
    try {
      setIsEmailSending(true);
      
      // Mock email sending for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Report sent to your email');
    } catch (error) {
      console.error('Error emailing PDF:', error);
      toast.error('Failed to email valuation report');
    } finally {
      setIsEmailSending(false);
    }
  };
  
  const downloadSamplePdf = async () => {
    try {
      setIsGenerating(true);
      
      // Create sample report data
      const sampleReportData: ReportData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        mileage: 25000,
        condition: 'Excellent',
        estimatedValue: 26500,
        confidenceScore: 92,
        vin: 'SAMPLE1234567890',
        zipCode: '90210',
        isPremium: false, // Set to false for the sample
        adjustments: [
          {
            factor: 'Mileage',
            impact: 1200,
            description: 'Lower than average mileage'
          },
          {
            factor: 'Condition',
            impact: 800,
            description: 'Excellent condition'
          },
          {
            factor: 'Market Demand',
            impact: 500,
            description: 'High demand in your area'
          }
        ],
        generatedAt: new Date().toISOString(),
        // Use tuple format directly
        priceRange: [25500, 28000],
      };
      
      // Generate PDF
      await downloadPdf(sampleReportData);
      
      toast.success('Sample report downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error generating sample PDF:', error);
      toast.error('Failed to generate sample report');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePdf,
    emailPdf,
    downloadSamplePdf,
    isGenerating,
    isEmailSending,
    pdfUrl
  };
}
