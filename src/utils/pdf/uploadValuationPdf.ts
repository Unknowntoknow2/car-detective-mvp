
import { supabase } from '@/integrations/supabase/client';
import { generateValuationPdf } from './generateValuationPdf';
import { ReportData } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface UploadPdfResult {
  url: string;
  filename: string;
  publicUrl?: string;
}

export async function uploadValuationPdf(
  reportData: ReportData,
  userId: string
): Promise<UploadPdfResult> {
  try {
    // Generate the PDF
    const pdfBytes = await generateValuationPdf(reportData, {
      isPremium: true,
      includeAuctionData: true,
      includeExplanation: true
    });

    // Create filename with timestamp and VIN
    const timestamp = Date.now();
    const vinSuffix = reportData.vin ? `-${reportData.vin.slice(-6)}` : '';
    const filename = `valuation-${reportData.make}-${reportData.model}${vinSuffix}-${timestamp}.pdf`;

    // Upload to Supabase Storage with user metadata
    const { data, error } = await supabase.storage
      .from('premium_reports')
      .upload(filename, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
        metadata: {
          user_id: userId,
          vehicle_vin: reportData.vin || '',
          vehicle_make: reportData.make,
          vehicle_model: reportData.model,
          estimated_value: reportData.estimatedValue.toString()
        }
      });

    if (error) {
      console.error('Error uploading PDF:', error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }

    // Generate a signed URL valid for 24 hours
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('premium_reports')
      .createSignedUrl(filename, 24 * 60 * 60); // 24 hours

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      throw new Error(`Failed to create download URL: ${signedUrlError.message}`);
    }

    if (!signedUrlData?.signedUrl) {
      throw new Error('No signed URL returned from Supabase');
    }

    return {
      url: signedUrlData.signedUrl,
      filename,
    };
  } catch (error) {
    console.error('Error in uploadValuationPdf:', error);
    throw error;
  }
}

export async function deletePremiumReport(filename: string): Promise<void> {
  const { error } = await supabase.storage
    .from('premium_reports')
    .remove([filename]);

  if (error) {
    console.error('Error deleting PDF:', error);
    throw new Error(`Failed to delete PDF: ${error.message}`);
  }
}
