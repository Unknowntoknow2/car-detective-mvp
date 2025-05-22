
import { useState } from 'react';
import { downloadPdf } from '@/utils/pdf';
import { ReportData, ReportOptions } from '@/utils/pdf/types';
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
        confidenceScore: valuationData.confidenceScore,
        priceRange: valuationData.priceRange,
        vin: valuationData.vin,
        zipCode: valuationData.zipCode,
        isPremium: isPremium,
        adjustments: valuationData.adjustments || [],
        generatedAt: new Date().toISOString(),
      };
      
      // Add condition data if available
      if (conditionData) {
        reportData.aiCondition = {
          condition: conditionData.condition || reportData.condition,
          confidenceScore: conditionData.confidenceScore || reportData.confidenceScore,
          issuesDetected: conditionData.issuesDetected || [],
          summary: conditionData.summary || `Vehicle is in ${reportData.condition} condition.`
        };
      }
      
      // Generate PDF options
      const options: Partial<ReportOptions> = {
        includeExplanation: true,
        isPremium: isPremium,
        watermarkText: isPremium ? 'Premium Report' : 'Car Detective Report',
      };
      
      // Generate PDF - Fix: pass only reportData as the first argument
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
        isPremium: true,
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
          },
          {
            factor: 'Optional Features',
            impact: 1500,
            description: 'Premium package with navigation'
          }
        ],
        generatedAt: new Date().toISOString(),
        aiCondition: {
          condition: 'Excellent',
          confidenceScore: 94,
          issuesDetected: [],
          summary: 'Vehicle is in excellent condition with no visible issues.'
        },
        priceRange: [25500, 28000],
        explanation: 'This is a sample valuation report showing the premium features available in Car Detective. The actual premium report includes detailed market analysis, comprehensive condition assessment, and personalized recommendations.',
      };
      
      // Generate PDF - Fix: pass only sampleReportData as the first argument
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
