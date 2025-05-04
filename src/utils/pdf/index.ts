import { ReportData } from './types';
import { generateBasicReport } from './generators/basicReportGenerator';
import { generatePremiumReport } from './generators/premiumReportGenerator';

/**
 * Downloads a PDF report with the given data
 */
export async function downloadPdf(data: ReportData): Promise<void> {
  try {
    const pdfBytes = await generatePdf(data);
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.make}_${data.model}_valuation_report.pdf`;
    
    // Append to the document and trigger a click
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generates a PDF report with the given data
 */
export async function generatePdf(data: ReportData): Promise<Uint8Array> {
  try {
    // Use the premium generator if this is a premium report
    if (data.isPremium) {
      // Convert ReportData to PremiumReportInput format
      const premiumInput = {
        vehicleInfo: {
          vin: data.vin,
          year: typeof data.year === 'string' ? parseInt(data.year, 10) : data.year as number,
          make: data.make,
          model: data.model,
          mileage: typeof data.mileage === 'string' ? parseInt(data.mileage as string, 10) : data.mileage as number,
          zipCode: data.zipCode
        },
        valuation: {
          basePrice: data.estimatedValue,
          estimatedValue: data.estimatedValue,
          priceRange: data.priceRange || [data.estimatedValue * 0.9, data.estimatedValue * 1.1] as [number, number],
          confidenceScore: data.confidenceScore || 85,
          adjustments: Array.isArray(data.adjustments) 
            ? data.adjustments.map(adj => {
                if ('factor' in adj) {
                  return { label: adj.factor, value: adj.impact };
                }
                return adj;
              })
            : []
        },
        carfaxData: data.carfaxData,
        forecast: undefined // Add if available in your data
      };
      
      return await generatePremiumReport(premiumInput);
    }
    
    // Otherwise use the basic generator
    return await generateBasicReport(data);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Helper function to convert vehicle info to report data format
 */
export function convertVehicleInfoToReportData(vehicleInfo: any, estimatedValueOrOptions: number | any): ReportData {
  // Check if second parameter is a number or an options object
  if (typeof estimatedValueOrOptions === 'number') {
    return {
      vin: vehicleInfo.vin || '',
      make: vehicleInfo.make || '',
      model: vehicleInfo.model || '',
      year: vehicleInfo.year || '',
      mileage: vehicleInfo.mileage || '0', // Ensure mileage is always provided
      plate: vehicleInfo.plate || '',
      state: vehicleInfo.state || '',
      color: vehicleInfo.color || '',
      estimatedValue: estimatedValueOrOptions || 0,
      fuelType: vehicleInfo.fuelType || '',
      condition: vehicleInfo.condition || '',
      zipCode: vehicleInfo.zipCode || '',
      bodyStyle: vehicleInfo.bodyType || '',
      confidenceScore: null,
    };
  } else {
    // It's an options object
    const options = estimatedValueOrOptions;
    return {
      vin: vehicleInfo.vin || '',
      make: vehicleInfo.make || '',
      model: vehicleInfo.model || '',
      year: vehicleInfo.year || '',
      mileage: vehicleInfo.mileage || options.mileage || '0',
      plate: vehicleInfo.plate || '',
      state: vehicleInfo.state || '',
      color: vehicleInfo.color || '',
      estimatedValue: options.estimatedValue || 0,
      fuelType: options.fuelType || '',
      condition: options.condition || '',
      zipCode: options.zipCode || '',
      confidenceScore: options.confidenceScore,
      adjustments: options.adjustments || [],
      carfaxData: options.carfaxData,
      isPremium: options.isPremium,
      bodyStyle: vehicleInfo.bodyType || '',
    };
  }
}

// Export the generator functions
export { generateBasicReport } from './generators/basicReportGenerator';
export { generatePremiumReport } from './generators/premiumReportGenerator';
