
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData } from '@/utils/pdf/types';

interface UseValuationPdfOptions {
  valuationId?: string;
  valuationData: any;
  conditionData: any;
}

export function useValuationPdf({ valuationId, valuationData, conditionData }: UseValuationPdfOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const generatePdf = async (options: { isPremium: boolean } = { isPremium: false }) => {
    try {
      setIsGenerating(true);
      
      // Build the report data
      const reportData: ReportData = valuationData ? {
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || new Date().getFullYear(),
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Good',
        estimatedValue: valuationData.estimatedValue || valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidenceScore || valuationData.confidence_score || 75,
        priceRange: Array.isArray(valuationData.priceRange) ? valuationData.priceRange : [0, 0],
        vin: valuationData.vin || '',
        zipCode: valuationData.zipCode || valuationData.zip || '',
        isPremium: options.isPremium,
        adjustments: (valuationData.adjustments || []).map((adj: any) => ({
          factor: adj.factor || '',
          impact: adj.impact || 0,
          description: adj.description || ''
        })),
        generatedAt: new Date().toISOString()
      } : {
        make: 'Sample',
        model: 'Vehicle',
        year: new Date().getFullYear(),
        mileage: 0,
        condition: 'Good',
        estimatedValue: 0,
        isPremium: options.isPremium,
        generatedAt: new Date().toISOString()
      };
      
      // If we have condition data, add it to the report
      if (conditionData) {
        reportData.aiCondition = conditionData;
      }
      
      // Call the PDF generation util
      await downloadValuationPdf(reportData, {
        isPremium: options.isPremium,
        includePhotoAssessment: !!conditionData,
      });
      
      // Record this download in analytics or logs if needed
      if (valuationId) {
        try {
          await supabase.from('pdf_downloads').insert({
            valuation_id: valuationId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            is_premium: options.isPremium
          });
        } catch (logError) {
          console.error('Failed to log PDF download:', logError);
          // Non-critical error, don't throw
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const emailPdf = async (email?: string) => {
    if (!valuationId) {
      toast.error('Valuation ID is required to email PDF');
      return false;
    }
    
    try {
      setIsEmailSending(true);
      
      // Get user's email if not provided
      let recipient = email;
      if (!recipient) {
        const { data } = await supabase.auth.getUser();
        recipient = data.user?.email;
        
        if (!recipient) {
          throw new Error('Email address is required');
        }
      }
      
      // Call the edge function to email the PDF
      const { error } = await supabase.functions.invoke('email-valuation-pdf', {
        body: { 
          valuationId,
          email: recipient
        }
      });
      
      if (error) throw error;
      
      toast.success('PDF report sent!', {
        description: `Check your inbox at ${recipient}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error emailing PDF:', error);
      toast.error('Failed to email PDF', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
      return false;
    } finally {
      setIsEmailSending(false);
    }
  };
  
  // For generating sample PDFs (used in premium page)
  const downloadSamplePdf = async () => {
    try {
      setIsGenerating(true);
      
      // Create sample report data
      const sampleData: ReportData = {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        mileage: 12500,
        condition: 'Excellent',
        estimatedValue: 42500,
        confidenceScore: 95,
        priceRange: [40375, 44625],
        vin: 'SAMPLE1VIN000001',
        zipCode: '90210',
        generatedAt: new Date().toISOString(),
        isSample: true,
        adjustments: [
          {
            factor: 'Mileage',
            impact: 1200,
            description: '12,500 miles (below average)'
          },
          {
            factor: 'Condition',
            impact: 1500,
            description: 'Excellent condition'
          },
          {
            factor: 'Market Demand',
            impact: 800,
            description: 'High demand in your area'
          }
        ],
        aiCondition: {
          condition: 'Excellent',
          score: 92,
          issues: ['Minor scuff on rear bumper'],
          confidence: 'High'
        }
      };
      
      // Call the PDF generation util
      await downloadValuationPdf(sampleData, {
        isPremium: true,
        includePhotoAssessment: true,
        watermark: 'SAMPLE REPORT'
      });
      
      return true;
    } catch (error) {
      console.error('Error generating sample PDF:', error);
      toast.error('Failed to generate sample PDF', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
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
    isEmailSending
  };
}
