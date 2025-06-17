import { rgb } from "pdf-lib";
import { SectionParams } from "../types";

// Define missing constants
const fonts = {
  regular: null as any, // Will be set properly in actual implementation
  bold: null as any
};
const textColor = rgb(0.3, 0.3, 0.3);

/**
 * Draws the valuation summary narrative section of the PDF
 * 
 * @param params Section parameters for the PDF
 * @param narrative The narrative text to display
 * @param yPosition The Y position to start drawing the section
 * @returns The new Y position after drawing the section
 */
export function drawValuationSummary(
  params: SectionParams,
  narrative: string,
  yPosition: number
): number {
  const { page, margin, contentWidth, regularFont, boldFont } = params;
  let currentY = yPosition;
  
  // Draw a light background for the narrative
  page.drawRectangle({
    x: margin,
    y: currentY - 80,
    width: contentWidth,
    height: 80,
    color: rgb(0.98, 0.98, 0.98)
  });
  
  // Draw executive summary heading
  page.drawText('Executive Summary', {
    x: margin + 10,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.5)
  });
  
  // Draw the narrative text, wrapping it as needed
  const fontSize = 10;
  const lineHeight = 14;
  const maxWidth = contentWidth - 20;
  
  // Split the narrative into words
  const words = narrative.split(' ');
  let line = '';
  let lineY = currentY - 40;
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const lineWidth = regularFont.widthOfTextAtSize(testLine, fontSize);
    
    if (lineWidth > maxWidth && line !== '') {
      // Draw the current line and move to the next
      page.drawText(line, {
        x: margin + 10,
        y: lineY,
        size: fontSize,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      lineY -= lineHeight;
      line = word;
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: margin + 10,
      y: lineY,
      size: fontSize,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    lineY -= lineHeight;
  }
  
  // Return the new Y position
  return lineY - 10;
}

/**
 * Generates a valuation narrative for the vehicle
 * 
 * @param input Vehicle details and valuation data
 * @returns Promise resolving to the narrative text
 */
export async function generateValuationNarrative(input: {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zipCode: string;
  condition: string;
  basePrice: number;
  adjustedPrice: number;
  confidenceScore: number;
  photoExplanation?: string;
  gptExplanation?: string;
  accidentCount?: number;
  zipMarketFactor?: string;
  fuelType?: string;
  transmission?: string;
}): Promise<string> {
  try {
    // For the initial implementation, we'll use a template-based approach
    // In a production environment, this would call OpenAI's API
    
    const { make, model, year, mileage, condition, adjustedPrice, confidenceScore } = input;
    const mileageText = mileage < 50000 ? "low" : mileage < 100000 ? "average" : "high";
    const conditionDesc = condition === "Excellent" ? "exceptionally well-maintained" : 
                         condition === "Good" ? "well-maintained" : 
                         condition === "Fair" ? "adequately maintained" : "showing significant wear";
    
    // If GPT-generated explanation is already available, return it directly
    if (input.gptExplanation) {
      return input.gptExplanation;
    }
    
    // Create a fallback narrative if no GPT explanation is provided
    let narrative = `This ${year} ${make} ${model} with ${mileage.toLocaleString()} miles (${mileageText} mileage) is in ${condition.toLowerCase()} condition, appearing ${conditionDesc}.`;
    
    // Add photo insight if available
    if (input.photoExplanation) {
      narrative += ` Visual assessment confirms ${input.photoExplanation.toLowerCase()}.`;
    }
    
    // Add accident info if available
    if (typeof input.accidentCount === 'number') {
      if (input.accidentCount === 0) {
        narrative += " No accident history was detected, positively affecting the valuation.";
      } else {
        const accidentText = input.accidentCount === 1 ? "a reported accident" : `${input.accidentCount} reported accidents`;
        narrative += ` The vehicle has ${accidentText}, which has been factored into the valuation.`;
      }
    }
    
    // Add ZIP market factor if available
    if (input.zipMarketFactor) {
      narrative += ` The local market in this area (${input.zipCode}) shows ${input.zipMarketFactor.toLowerCase()} demand for this vehicle.`;
    }
    
    // Add conclusion with confidence level
    const confidenceLevel = confidenceScore >= 90 ? "high" : confidenceScore >= 75 ? "good" : "moderate";
    narrative += ` Based on our comprehensive analysis, the estimated value is ${formatCurrency(adjustedPrice)} with a ${confidenceLevel} confidence score of ${confidenceScore}%.`;
    
    return narrative;
    
  } catch (error) {
    console.error("Error generating valuation narrative:", error);
    // Return fallback message if generation fails
    return "This vehicle has been valued based on its condition, mileage, and current market factors. Our analysis considers comparable listings, regional variances, and vehicle-specific details to provide an accurate estimate.";
  }
}

/**
 * Helper function to format currency values
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
