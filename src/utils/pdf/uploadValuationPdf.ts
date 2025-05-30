
import { supabase } from '@/integrations/supabase/client';
import { generateValuationPdf } from './generateValuationPdf';
import { ReportData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { generateAINSummaryForPdf, formatAINSummaryForPdf } from '../ain/generateSummaryForPdf';
import { generateTrackingId, createWatermarkConfig, createTrackingConfig } from './addWatermarkAndTracking';
import { generateDebugInfo, formatDebugInfoForPdf } from './generateDebugInfo';
import { sendPdfToVerifiedDealers } from '../../emails/sendValuationPdfToDealer';

export interface UploadPdfResult {
  url: string;
  filename: string;
  trackingId: string;
  publicUrl?: string;
}

export async function uploadValuationPdf(
  reportData: ReportData,
  userId: string,
  options: {
    emailToDealers?: boolean;
    includeDebugInfo?: boolean;
    includeAINSummary?: boolean;
  } = {}
): Promise<UploadPdfResult> {
  try {
    // Generate tracking ID and watermark config
    const trackingId = generateTrackingId(userId, reportData.vin);
    const watermarkConfig = createWatermarkConfig(true);
    const trackingConfig = createTrackingConfig(userId, reportData.vin);

    // Generate AIN summary if requested
    let ainSummary = '';
    if (options.includeAINSummary !== false) {
      try {
        const summaryData = await generateAINSummaryForPdf(reportData);
        ainSummary = formatAINSummaryForPdf(summaryData);
      } catch (error) {
        console.error('Failed to generate AIN summary:', error);
      }
    }

    // Generate debug info if requested (typically for internal use)
    let debugInfo = '';
    if (options.includeDebugInfo && process.env.NODE_ENV === 'development') {
      const debugData = generateDebugInfo(reportData);
      debugInfo = formatDebugInfoForPdf(debugData);
    }

    // Generate the PDF with enhanced features
    const pdfBytes = await generateValuationPdf(reportData, {
      isPremium: true,
      includeAuctionData: true,
      includeExplanation: true,
      watermark: watermarkConfig.enabled ? watermarkConfig.text : undefined,
      trackingId,
      ainSummary,
      debugInfo
    });

    // Create filename with tracking ID
    const timestamp = Date.now();
    const vinSuffix = reportData.vin ? `-${reportData.vin.slice(-6)}` : '';
    const filename = `valuation-${reportData.make}-${reportData.model}${vinSuffix}-${trackingId}.pdf`;

    // Upload to Supabase Storage with enhanced metadata
    const { data, error } = await supabase.storage
      .from('premium_reports')
      .upload(filename, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
        metadata: {
          user_id: userId,
          tracking_id: trackingId,
          vehicle_vin: reportData.vin || '',
          vehicle_make: reportData.make,
          vehicle_model: reportData.model,
          estimated_value: reportData.estimatedValue.toString(),
          includes_ain_summary: String(!!ainSummary),
          includes_debug_info: String(!!debugInfo),
          watermarked: String(watermarkConfig.enabled)
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

    const result: UploadPdfResult = {
      url: signedUrlData.signedUrl,
      filename,
      trackingId
    };

    // Email to verified dealers if requested
    if (options.emailToDealers !== false) {
      try {
        await sendPdfToVerifiedDealers(
          trackingId,
          signedUrlData.signedUrl,
          {
            year: reportData.year,
            make: reportData.make,
            model: reportData.model,
            vin: reportData.vin
          },
          reportData.estimatedValue
        );
      } catch (emailError) {
        console.error('Failed to email PDF to dealers:', emailError);
        // Don't fail the upload if email fails
      }
    }

    return result;
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
