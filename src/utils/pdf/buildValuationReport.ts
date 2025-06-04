<<<<<<< HEAD
import { ValuationResult } from '@/types/valuation';

export const buildValuationReport = (result: ValuationResult | null, includeCarfax: boolean = false, templateType: 'basic' | 'premium' = 'basic') => {
  if (!result) {
    return {
      id: 'N/A',
      make: 'N/A',
      model: 'N/A',
      year: 0,
      mileage: 0,
      condition: 'N/A',
      price: 0,
      zipCode: 'N/A',
      vin: 'N/A',
      fuelType: 'N/A',
      transmission: 'N/A',
      color: 'N/A',
      bodyType: 'N/A',
      confidenceScore: 0,
      isPremium: false,
      priceRange: [0, 0] as [number, number],
      adjustments: [],
      generatedAt: new Date().toISOString(),
      explanation: 'N/A',
      userId: 'N/A',
    };
  }

  // Handle different price range formats
  let formattedPriceRange: [number, number] = [0, 0];
  if (Array.isArray(result.priceRange)) {
    if (result.priceRange.length >= 2) {
      formattedPriceRange = [result.priceRange[0], result.priceRange[1]];
    } else if (result.priceRange.length === 1) {
      formattedPriceRange = [result.priceRange[0], result.priceRange[0]];
=======
import { ReportData, SectionParams } from "./types";

// Define the drawValuationSummary function
export function drawValuationSummary(
  sectionParams: SectionParams,
  narrative: string,
  yPosition: number,
  isPremium: boolean = false,
  includeTimestamp: boolean = true,
): number {
  const {
    page,
    margin,
    contentWidth,
    boldFont,
    regularFont,
    primaryColor,
    textColor,
  } = sectionParams;

  // Safety checks for required properties
  if (
    !page || !margin || !contentWidth || !boldFont || !regularFont ||
    !primaryColor || !textColor
  ) {
    console.error("Missing required properties in sectionParams", {
      hasPage: !!page,
      hasMargin: !!margin,
      hasContentWidth: !!contentWidth,
      hasBoldFont: !!boldFont,
      hasRegularFont: !!regularFont,
    });
    return yPosition;
  }

  // Draw heading
  page.drawText("Valuation Summary", {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });

  yPosition -= 25;

  // Split narrative into lines to fit within content width
  const words = narrative.split(" ");
  let currentLine = "";
  const lines: string[] = [];

  // Mock calculation for line width if font object doesn't have widthOfTextAtSize
  const calculateTextWidth = (text: string, fontSize: number) => {
    // Simple approximation: assume each character is ~0.6 times the font size wide
    return text.length * fontSize * 0.6;
  };

  const getTextWidth = typeof regularFont === "string"
    ? (text: string) => calculateTextWidth(text, 12)
    : (text: string) => (regularFont as any).widthOfTextAtSize(text, 12);

  for (const word of words) {
    const testLine = currentLine + word + " ";
    if (getTextWidth(testLine) > contentWidth) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = testLine;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }
  } else if (result.priceRange && typeof result.priceRange === 'object' && 'min' in result.priceRange && 'max' in result.priceRange) {
    formattedPriceRange = [result.priceRange.min, result.priceRange.max];
  }
<<<<<<< HEAD

  return {
    id: result.id || 'N/A',
    make: result.make || 'N/A',
    model: result.model || 'N/A',
    year: result.year || 0,
    mileage: result.mileage || 0,
    condition: result.condition || 'N/A',
    price: result.estimatedValue || result.estimated_value || 0,
    zipCode: result.zipCode || 'N/A',
    vin: result.vin || 'N/A',
    fuelType: result.fuelType || result.fuel_type || 'N/A',
    transmission: result.transmission || 'N/A',
    color: result.color || 'N/A',
    bodyType: result.bodyType || result.body_type || 'N/A',
    confidenceScore: result.confidenceScore || result.confidence_score || 0,
    isPremium: result.isPremium || result.premium_unlocked || false,
    priceRange: formattedPriceRange,
    adjustments: result.adjustments || [],
    generatedAt: new Date().toISOString(),
    explanation: result.explanation || result.gptExplanation || 'N/A',
    userId: result.userId || 'N/A',
    trim: result.trim || 'N/A',
  };
};

export default buildValuationReport;
=======

  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw each line of text
  for (const line of lines) {
    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: textColor,
    });
    yPosition -= 18;
  }

  // Add timestamp if requested
  if (includeTimestamp) {
    yPosition -= 10;
    page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    yPosition -= 15;
  }

  return yPosition; // Return updated position
}

// Export a function that shows how to use drawValuationSummary
export function buildValuationSummarySection(
  sectionParams: SectionParams,
  reportData: ReportData,
): number {
  // Use height and margins in a safely way
  const startY = sectionParams.height
    ? sectionParams.height -
      ((sectionParams.margins?.top || sectionParams.margin || 40) + 100)
    : 700;

  // Generate narrative if not provided
  const narrative = reportData.narrative ||
    `This valuation report for your ${reportData.year} ${reportData.make} ${reportData.model} ` +
      `provides an estimated market value of $${
        reportData.estimatedValue?.toLocaleString() ||
        reportData.price.toLocaleString()
      } ` +
      `based on vehicle condition, mileage, and local market factors.`;

  // Call the function with all required parameters
  const yPosition = drawValuationSummary(
    sectionParams,
    narrative,
    startY,
    reportData.isPremium,
    true, // includeTimestamp
  );

  return yPosition;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
