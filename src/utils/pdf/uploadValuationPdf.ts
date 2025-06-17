import { supabase } from '@/integrations/supabase/client';
import { generateValuationPdf } from './generateValuationPdf';
import { ReportData, PdfOptions } from './types';
import { generateSummaryForPdf } from '../ain/generateSummaryForPdf';

export async function uploadValuationPdf(
  data: ReportData,
  options: PdfOptions = {}
): Promise<string | null> {
  try {
    const pdfBuffer = await generateValuationPdf(data, {
      isPremium: options.isPremium,
      includeExplanation: options.includeExplanation,
      marketplaceListings: options.marketplaceListings
    });

    const fileName = `valuation-${data.id}.pdf`;
    const filePath = `pdfs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('valuation-pdfs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading PDF to Supabase:', uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('valuation-pdfs')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error('Error getting public URL for PDF');
      return null;
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return null;
  }
}
