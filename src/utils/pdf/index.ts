
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { ReportData } from './types';
import { convertVehicleInfoToReportData } from './dataConverter';
import { generateValuationPdf } from './pdfGenerator';

/**
 * Downloads a PDF report for the given vehicle data
 */
export const downloadPdf = async (data: ReportData) => {
  // Show a toast for long-running operation
  const toastId = toast.loading('Generating your PDF report...', {
    duration: 5000 // Set a longer duration for PDF generation
  });

  try {
    // Create new PDF document using pdf-lib
    const pdfBytes = await generateValuationPdf(data);
    
    // Convert to Blob
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create an invisible download link
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename
    const filename = `${data.make}_${data.model}_Valuation_${new Date().toISOString().split('T')[0]}.pdf`;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
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

// Export all the necessary functions
export { convertVehicleInfoToReportData } from './dataConverter';
export { generateValuationPdf } from './pdfGenerator';
