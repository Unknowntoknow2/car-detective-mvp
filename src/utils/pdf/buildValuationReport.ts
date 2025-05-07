
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { supabase } from '../supabaseClient';
import { ReportData, SectionParams } from './types';
import { generateValuationNarrative } from './sections/valuationSummary';
import { applyWatermark } from './sections/watermark';
import { drawVehicleInfoSection } from './sections/vehicleInfoSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawExplanationSection } from './sections/explanationSection';
import { drawFooterSection } from './sections/footerSection';
import { drawValuationSummary } from './sections/valuationSummary';
import { renderAdjustmentTable } from './sections/adjustmentTable';

/**
 * Main orchestrator function that builds a complete valuation report PDF
 * @param valuationId The UUID of the valuation to generate a report for
 * @returns Promise resolving to PDF document as Buffer
 */
export async function buildValuationReport(valuationId: string): Promise<Uint8Array> {
  try {
    // 1. Fetch valuation data from Supabase
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
    
    if (valuationError || !valuation) {
      console.error('Error fetching valuation:', valuationError);
      throw new Error(`Valuation not found: ${valuationId}`);
    }
    
    // 2. Fetch photo data (if available)
    const { data: photos, error: photosError } = await supabase
      .from('valuation_photos')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('score', { ascending: false });
    
    // 3. Fetch adjustments (if available)
    const { data: adjustments, error: adjustmentsError } = await supabase
      .from('valuation_adjustments')
      .select('*')
      .eq('valuation_id', valuationId);
    
    // 4. Prepare the report data
    const bestPhoto = photos && photos.length > 0 ? photos[0] : null;
    
    // Convert to ReportData format
    const reportData: ReportData = {
      vin: valuation.vin || 'Unknown',
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      mileage: valuation.mileage?.toString() || '0',
      condition: (valuation.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor') || 'Good',
      zipCode: valuation.zip_code || '',
      estimatedValue: valuation.estimated_value,
      confidenceScore: valuation.confidence_score || 85,
      color: valuation.color || 'Not Specified',
      bodyStyle: valuation.body_type || 'Not Specified',
      bodyType: valuation.body_type || 'Not Specified',
      fuelType: valuation.fuel_type || 'Not Specified',
      explanation: valuation.explanation || '',
      isPremium: valuation.is_premium || false,
      valuationId: valuation.id,
      transmission: valuation.transmission || 'Not Specified',
      bestPhotoUrl: bestPhoto?.photo_url,
      photoExplanation: bestPhoto?.explanation,
      adjustments: adjustments?.map(adj => ({
        factor: adj.factor,
        impact: adj.impact,
        description: adj.description || ''
      })) || []
    };
    
    // 5. Generate narrative if not available
    if (!reportData.narrative) {
      try {
        // Calculate base price
        const basePrice = reportData.adjustments.length > 0 
          ? reportData.estimatedValue - reportData.adjustments.reduce((sum, adj) => sum + adj.impact, 0)
          : reportData.estimatedValue;
          
        reportData.narrative = await generateValuationNarrative({
          make: reportData.make,
          model: reportData.model,
          year: reportData.year,
          mileage: parseInt(reportData.mileage.toString()),
          zipCode: reportData.zipCode,
          condition: reportData.condition,
          basePrice: basePrice,
          adjustedPrice: reportData.estimatedValue,
          confidenceScore: reportData.confidenceScore,
          photoExplanation: reportData.photoExplanation,
          fuelType: reportData.fuelType,
          transmission: reportData.transmission
        });
      } catch (error) {
        console.error("Error generating narrative:", error);
        // Continue without narrative if generation fails
      }
    }
    
    // 6. Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    
    // 7. Embed fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // 8. Set up drawing parameters
    const margin = 50;
    const contentWidth = width - margin * 2;
    
    // 9. Create section params object
    const sectionParams: SectionParams = {
      page,
      width,
      height,
      margin,
      regularFont,
      boldFont,
      contentWidth
    };
    
    // 10. Apply watermark if premium
    if (reportData.isPremium) {
      applyWatermark(sectionParams, "Car Detective™ • Premium Report");
    }
    
    // 11. Track vertical position
    let yPosition = height - margin;
    
    // 12. Draw header
    page.drawRectangle({
      x: margin,
      y: height - margin - 50,
      width: contentWidth,
      height: 50,
      color: rgb(0.95, 0.95, 0.95),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    
    page.drawText("Vehicle Valuation Report", {
      x: margin + 10,
      y: height - margin - 30,
      size: 18,
      font: boldFont
    });
    
    yPosition -= 70;
    
    // 13. Draw narrative if available
    if (reportData.narrative) {
      yPosition = drawValuationSummary(sectionParams, reportData.narrative, yPosition);
      yPosition -= 20;
    }
    
    // 14. Draw vehicle info section
    yPosition = drawVehicleInfoSection(sectionParams, reportData, yPosition);
    
    // 15. Draw valuation section
    yPosition = drawValuationSection(sectionParams, reportData, yPosition);
    
    // 16. Draw explanation if available
    if (reportData.explanation) {
      yPosition = drawExplanationSection(sectionParams, reportData.explanation, yPosition);
    }
    
    // 17. Draw footer
    drawFooterSection(
      sectionParams,
      true, // includeTimestamp
      1,    // pageNumber
      1,    // totalPages
      reportData.isPremium // includeWatermark
    );
    
    // 18. Generate and return PDF bytes
    return await pdfDoc.save();
    
  } catch (error) {
    console.error("Error generating valuation report:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}
