
import { jsPDF } from 'jspdf';
import { ReportData } from './types';
import { reportPdfImage } from './reportBackground';
import { addValuationDetails } from './sections/valuationDetails';
import { addVehicleDetails } from './sections/vehicleDetails';
import { addPremiumBadge } from './sections/premiumBadge';
import { addLogo } from './sections/logo';
import { addFooter } from './sections/footer';
import { addTimestamp } from './sections/timestamp';
import { addExplanation } from './sections/explanation';
import { addHeader } from './sections/header';
import { toast } from 'sonner';

/**
 * Downloads a PDF report for the given vehicle data
 */
export const downloadPdf = async (data: ReportData) => {
  // Show a toast for long-running operation
  const toastId = toast.loading('Generating your PDF report...', {
    duration: 5000 // Set a longer duration for PDF generation
  });

  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add report background image
    const img = new Image();
    img.src = reportPdfImage;
    doc.addImage(img, 'PNG', 0, 0, 210, 297);

    // Add logo and header
    addLogo(doc);
    addHeader(doc, data);
    
    // Add timestamp at the top right
    addTimestamp(doc);
    
    // Add premium badge if applicable
    if (data.isPremium) {
      addPremiumBadge(doc);
    }
    
    // Add vehicle details section
    addVehicleDetails(doc, data);
    
    // Add valuation details
    addValuationDetails(doc, data);
    
    // Add explanation if available
    if (data.explanation && data.explanation.length > 0) {
      addExplanation(doc, data.explanation);
    }
    
    // Add footer with disclaimer
    addFooter(doc);
    
    // Generate filename
    const filename = `${data.make}_${data.model}_Valuation_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save file
    doc.save(filename);
    
    // Dismiss loading toast and show success
    toast.dismiss(toastId);
    toast.success('PDF report generated successfully', {
      description: `Saved as ${filename}`
    });
    
    return filename;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Dismiss loading toast and show error
    toast.dismiss(toastId);
    toast.error('Failed to generate PDF report', {
      description: 'Please try again or contact support if the problem persists.',
      action: {
        label: 'Try Again',
        onClick: () => downloadPdf(data)
      }
    });
    
    return null;
  }
};
