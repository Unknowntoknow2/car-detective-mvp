
import { ReportData, ReportOptions, SectionParams } from '../types';
import { jsPDF } from 'jspdf';

/**
 * Premium Report Generator
 * Generates a PDF report with enhanced features for premium users
 */
export class PremiumReportGenerator {
  private data: ReportData;
  private options: ReportOptions;
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private currentY: number;
  private fonts: {
    regular: string;
    bold: string;
    italic: string;
  };
  private colors: {
    primary: string;
    text: string;
    accent: string;
    background: string;
  };

  constructor(data: ReportData, options: ReportOptions) {
    this.data = data;
    this.options = {
      ...options,
      isPremium: true // Ensure this is a premium report
    };
    
    // Initialize PDF document
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    // Get current page info - use internal API to get page dimensions
    // Fixed: Changed getPage to use internal properties
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    
    // Set margins and content width
    this.margin = 40;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = this.margin;
    
    // Define fonts
    this.fonts = {
      regular: 'Helvetica',
      bold: 'Helvetica-Bold',
      italic: 'Helvetica-Oblique'
    };
    
    // Define colors
    this.colors = {
      primary: '#0066CC',
      text: '#333333',
      accent: '#4CAF50',
      background: '#F5F5F5'
    };
    
    // Register fonts if needed
    // this.registerFonts();
  }
  
  /**
   * Generate the PDF report
   * @returns Promise resolving to Uint8Array containing the PDF
   */
  async generate(): Promise<Uint8Array> {
    try {
      // Add cover page
      this.addCoverPage();
      
      // Add summary page
      this.doc.addPage();
      this.currentY = this.margin;
      this.addSummaryPage();
      
      // Add valuation breakdown
      this.doc.addPage();
      this.currentY = this.margin;
      this.addValuationBreakdown();
      
      // Add vehicle details
      this.doc.addPage();
      this.currentY = this.margin;
      this.addVehicleDetails();
      
      // Add photo assessment if included
      if (this.options.includePhotoAssessment && this.data.aiCondition) {
        this.doc.addPage();
        this.currentY = this.margin;
        this.addPhotoAssessment();
      }
      
      // Add explanation if included
      if (this.options.includeExplanation && this.data.explanation) {
        this.doc.addPage();
        this.currentY = this.margin;
        this.addExplanation();
      }
      
      // Add footer to all pages
      this.addFooterToAllPages();
      
      // Add watermark if specified
      if (this.options.watermark) {
        this.addWatermark();
      }
      
      // Save the document and convert to Uint8Array
      const pdfData = this.doc.output('arraybuffer');
      
      // Fixed: Convert ArrayBuffer to Uint8Array correctly
      return new Uint8Array(pdfData);
    } catch (error) {
      console.error('Error generating premium PDF report:', error);
      throw error;
    }
  }
  
  /**
   * Add the cover page to the PDF
   */
  private addCoverPage(): void {
    const sectionParams: SectionParams = {
      page: this.doc,
      startY: this.currentY,
      width: this.contentWidth,
      margin: this.margin,
      data: this.data,
      options: this.options,
      textColor: this.colors.text,
      primaryColor: this.colors.primary,
      fonts: {
        regular: this.fonts.regular,
        bold: this.fonts.bold,
        italic: this.fonts.italic
      }
    };
    
    // Add logo if branding is included
    if (this.options.includeBranding) {
      this.doc.setFontSize(12);
      this.doc.setFont(this.fonts.bold);
      this.doc.setTextColor(this.colors.primary);
      this.doc.text('Car Detective', this.margin, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.doc.setTextColor(this.colors.text);
      this.currentY += 30;
    }
    
    // Add report title
    this.doc.setFontSize(24);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Vehicle Valuation Report', this.margin, this.currentY);
    this.currentY += 50;
    
    // Add vehicle name
    this.doc.setFontSize(18);
    this.doc.setTextColor(this.colors.text);
    const vehicleName = `${this.data.year} ${this.data.make} ${this.data.model}`;
    this.doc.text(vehicleName, this.margin, this.currentY);
    this.currentY += 30;
    
    // Add premium badge if isPremium
    if (this.data.isPremium) {
      this.doc.setFillColor(this.colors.primary);
      this.doc.roundedRect(this.margin, this.currentY, 120, 30, 5, 5, 'F');
      this.doc.setTextColor('#FFFFFF');
      this.doc.setFontSize(14);
      this.doc.text('PREMIUM REPORT', this.margin + 10, this.currentY + 20);
      this.doc.setTextColor(this.colors.text);
      this.currentY += 50;
    }
    
    // Add cover image placeholder
    this.doc.setFillColor('#EEEEEE');
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 200, 'F');
    this.doc.setTextColor('#999999');
    this.doc.setFontSize(14);
    this.doc.text('Vehicle Image', this.pageWidth / 2, this.currentY + 100, { align: 'center' });
    this.currentY += 220;
    
    // Add estimated value
    this.doc.setFontSize(14);
    this.doc.setTextColor(this.colors.text);
    this.doc.text('Estimated Value:', this.margin, this.currentY);
    this.currentY += 30;
    
    this.doc.setFontSize(32);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.accent);
    const formattedValue = `$${this.data.estimatedValue.toLocaleString()}`;
    this.doc.text(formattedValue, this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 60;
    
    // Add generation date
    const generationDate = this.data.generatedAt
      ? new Date(this.data.generatedAt).toLocaleDateString()
      : new Date().toLocaleDateString();
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(this.colors.text);
    this.doc.text(`Report generated on: ${generationDate}`, this.margin, this.currentY);
  }
  
  /**
   * Add the summary page to the PDF
   */
  private addSummaryPage(): void {
    // Add page title
    this.doc.setFontSize(20);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Valuation Summary', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 40;
    
    // Add vehicle information section
    this.doc.setFillColor(this.colors.background);
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 180, 'F');
    this.currentY += 20;
    
    // Vehicle details
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.colors.text);
    
    // Make, Model, Year
    this.doc.setFont(this.fonts.bold);
    this.doc.text('Vehicle:', this.margin + 20, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.doc.text(`${this.data.year} ${this.data.make} ${this.data.model}`, this.margin + 120, this.currentY);
    this.currentY += 25;
    
    // VIN
    if (this.data.vin) {
      this.doc.setFont(this.fonts.bold);
      this.doc.text('VIN:', this.margin + 20, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.doc.text(this.data.vin, this.margin + 120, this.currentY);
      this.currentY += 25;
    }
    
    // Mileage
    this.doc.setFont(this.fonts.bold);
    this.doc.text('Mileage:', this.margin + 20, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.doc.text(`${this.data.mileage.toLocaleString()} miles`, this.margin + 120, this.currentY);
    this.currentY += 25;
    
    // Condition
    this.doc.setFont(this.fonts.bold);
    this.doc.text('Condition:', this.margin + 20, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.doc.text(this.data.condition, this.margin + 120, this.currentY);
    this.currentY += 25;
    
    // Location
    if (this.data.zipCode) {
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Location:', this.margin + 20, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.doc.text(`ZIP: ${this.data.zipCode}`, this.margin + 120, this.currentY);
      this.currentY += 25;
    }
    
    // Confidence score
    if (this.data.confidenceScore) {
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Confidence:', this.margin + 20, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.doc.text(`${this.data.confidenceScore}%`, this.margin + 120, this.currentY);
      this.currentY += 25;
    }
    
    this.currentY += 20;
    
    // Valuation result section
    this.doc.setFontSize(16);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Estimated Value', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 30;
    
    // Value
    this.doc.setFontSize(28);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.accent);
    const formattedValue = `$${this.data.estimatedValue.toLocaleString()}`;
    this.doc.text(formattedValue, this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 40;
    
    // Price range if available
    if (this.data.priceRange && Array.isArray(this.data.priceRange) && this.data.priceRange.length === 2) {
      this.doc.setFontSize(14);
      this.doc.setTextColor(this.colors.text);
      this.doc.text('Price Range:', this.margin, this.currentY);
      this.currentY += 25;
      
      const formattedRange = `$${this.data.priceRange[0].toLocaleString()} - $${this.data.priceRange[1].toLocaleString()}`;
      this.doc.text(formattedRange, this.margin, this.currentY);
      this.currentY += 40;
    }
    
    // Fixed: Changed boldFontToUse to use the correct bold font property
    // Add note about premium features
    this.doc.setFontSize(12);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Premium Report Features:', this.margin, this.currentY);
    this.currentY += 20;
    
    this.doc.setFont(this.fonts.regular);
    this.doc.setTextColor(this.colors.text);
    
    const premiumFeatures = [
      'Comprehensive vehicle valuation',
      'Detailed market analysis',
      'Vehicle condition assessment',
      'Price adjustment factors',
      'Extended vehicle history summary'
    ];
    
    premiumFeatures.forEach(feature => {
      this.doc.text(`• ${feature}`, this.margin + 10, this.currentY);
      this.currentY += 20;
    });
  }
  
  /**
   * Add valuation breakdown section to the PDF
   */
  private addValuationBreakdown(): void {
    // Add page title
    this.doc.setFontSize(20);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Valuation Breakdown', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 40;
    
    // Add section description
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.colors.text);
    this.doc.text('The following factors were considered in determining the vehicle value:', this.margin, this.currentY);
    this.currentY += 30;
    
    // Base value section
    this.doc.setFontSize(14);
    this.doc.setFont(this.fonts.bold);
    this.doc.text('Base Value', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 25;
    
    // Calculate base value (estimated value minus all adjustments)
    let baseValue = this.data.estimatedValue;
    if (this.data.adjustments && Array.isArray(this.data.adjustments)) {
      baseValue = this.data.estimatedValue - this.data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    }
    
    this.doc.setFontSize(12);
    this.doc.text(`Base value for ${this.data.year} ${this.data.make} ${this.data.model}:`, this.margin + 10, this.currentY);
    this.doc.text(`$${baseValue.toLocaleString()}`, this.contentWidth, this.currentY, { align: 'right' });
    this.currentY += 30;
    
    // Adjustments section
    if (this.data.adjustments && Array.isArray(this.data.adjustments) && this.data.adjustments.length > 0) {
      this.doc.setFontSize(14);
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Value Adjustments', this.margin, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.currentY += 25;
      
      // Draw header row
      this.doc.setFillColor(this.colors.background);
      this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 25, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Factor', this.margin + 10, this.currentY);
      this.doc.text('Impact', this.margin + 300, this.currentY);
      this.doc.text('Description', this.margin + 400, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.currentY += 20;
      
      // Draw each adjustment row
      this.data.adjustments.forEach((adjustment, index) => {
        const rowY = this.currentY;
        
        // Apply alternating row background
        if (index % 2 === 0) {
          this.doc.setFillColor('#F9F9F9');
          this.doc.rect(this.margin, rowY - 15, this.contentWidth, 25, 'F');
        }
        
        this.doc.text(adjustment.factor, this.margin + 10, rowY);
        
        // Format impact value with sign
        const impactFormatted = adjustment.impact >= 0 
          ? `+$${adjustment.impact.toLocaleString()}`
          : `-$${Math.abs(adjustment.impact).toLocaleString()}`;
        
        // Set color based on impact (positive/negative)
        this.doc.setTextColor(adjustment.impact >= 0 ? this.colors.accent : '#FF4444');
        this.doc.text(impactFormatted, this.margin + 300, rowY);
        this.doc.setTextColor(this.colors.text);
        
        // Description
        if (adjustment.description) {
          this.doc.text(adjustment.description, this.margin + 400, rowY);
        }
        
        this.currentY += 25;
      });
      
      // Draw total row
      this.currentY += 10;
      this.doc.setFillColor(this.colors.background);
      this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 25, 'F');
      
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Total Adjustments:', this.margin + 10, this.currentY);
      
      // Calculate total adjustments
      const totalAdjustment = this.data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
      const totalFormatted = totalAdjustment >= 0 
        ? `+$${totalAdjustment.toLocaleString()}`
        : `-$${Math.abs(totalAdjustment).toLocaleString()}`;
      
      // Set color based on total impact
      this.doc.setTextColor(totalAdjustment >= 0 ? this.colors.accent : '#FF4444');
      this.doc.text(totalFormatted, this.margin + 300, this.currentY);
      this.doc.setTextColor(this.colors.text);
      
      this.currentY += 40;
    }
    
    // Final value section
    this.doc.setFillColor(this.colors.primary);
    this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 40, 'F');
    
    this.doc.setFontSize(16);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor('#FFFFFF');
    this.doc.text('Final Estimated Value:', this.margin + 10, this.currentY + 5);
    
    const formattedValue = `$${this.data.estimatedValue.toLocaleString()}`;
    this.doc.text(formattedValue, this.contentWidth, this.currentY + 5, { align: 'right' });
    
    this.doc.setFont(this.fonts.regular);
    this.doc.setTextColor(this.colors.text);
    this.currentY += 50;
    
    // Add confidence score section if available
    if (this.data.confidenceScore) {
      this.doc.setFontSize(14);
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Confidence Score', this.margin, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.currentY += 25;
      
      this.doc.setFontSize(12);
      this.doc.text('Our confidence in this valuation:', this.margin + 10, this.currentY);
      
      // Draw confidence bar
      const confidenceWidth = 200;
      const filledWidth = (this.data.confidenceScore / 100) * confidenceWidth;
      
      this.doc.setFillColor('#EEEEEE');
      this.doc.rect(this.margin + 250, this.currentY - 10, confidenceWidth, 20, 'F');
      
      this.doc.setFillColor(this.getConfidenceColor(this.data.confidenceScore));
      this.doc.rect(this.margin + 250, this.currentY - 10, filledWidth, 20, 'F');
      
      this.doc.setTextColor('#FFFFFF');
      this.doc.text(`${this.data.confidenceScore}%`, this.margin + 250 + filledWidth / 2, this.currentY, { align: 'center' });
      this.doc.setTextColor(this.colors.text);
      
      this.currentY += 40;
    }
  }
  
  /**
   * Add vehicle details section to the PDF
   */
  private addVehicleDetails(): void {
    // Add page title
    this.doc.setFontSize(20);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Vehicle Details', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 40;
    
    // Vehicle information section
    this.doc.setFontSize(14);
    this.doc.setFont(this.fonts.bold);
    this.doc.text('Vehicle Information', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 25;
    
    this.doc.setFillColor(this.colors.background);
    this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 250, 'F');
    
    // Create details grid
    this.doc.setFontSize(12);
    
    const details = [
      { label: 'Make', value: this.data.make },
      { label: 'Model', value: this.data.model },
      { label: 'Year', value: this.data.year.toString() },
      { label: 'VIN', value: this.data.vin || 'N/A' },
      { label: 'Mileage', value: `${this.data.mileage.toLocaleString()} miles` },
      { label: 'Condition', value: this.data.condition },
      { label: 'Trim', value: this.data.trim || 'N/A' },
      { label: 'Body Style', value: this.data.bodyStyle || 'N/A' },
      { label: 'Transmission', value: this.data.transmission || 'N/A' },
      { label: 'Color', value: this.data.color || 'N/A' },
      { label: 'Fuel Type', value: this.data.fuelType || 'N/A' },
      { label: 'Region', value: this.data.regionName || (this.data.zipCode ? `ZIP: ${this.data.zipCode}` : 'N/A') }
    ];
    
    // Create a two-column layout for details
    const colWidth = this.contentWidth / 2;
    let colY = this.currentY;
    
    details.forEach((detail, index) => {
      const col = index % 2;
      const xPos = this.margin + (col * colWidth) + 10;
      
      if (index % 2 === 0 && index > 0) {
        colY += 30;
      }
      
      this.doc.setFont(this.fonts.bold);
      this.doc.text(`${detail.label}:`, xPos, colY);
      this.doc.setFont(this.fonts.regular);
      this.doc.text(detail.value, xPos + 100, colY);
    });
    
    this.currentY = colY + 40;
    
    // Features section if available
    if (this.data.features && Array.isArray(this.data.features) && this.data.features.length > 0) {
      this.doc.setFontSize(14);
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Features', this.margin, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.currentY += 25;
      
      this.doc.setFillColor(this.colors.background);
      this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 150, 'F');
      
      // Create a three-column layout for features
      const featureColWidth = this.contentWidth / 3;
      let featureY = this.currentY;
      
      this.doc.setFontSize(12);
      
      this.data.features.forEach((feature, index) => {
        const col = index % 3;
        const xPos = this.margin + (col * featureColWidth) + 10;
        
        if (index % 3 === 0 && index > 0) {
          featureY += 25;
        }
        
        this.doc.text(`• ${feature}`, xPos, featureY);
      });
      
      this.currentY = featureY + 40;
    }
  }
  
  /**
   * Add photo assessment section if included
   */
  private addPhotoAssessment(): void {
    if (!this.data.aiCondition) return;
    
    // Add page title
    this.doc.setFontSize(20);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('AI Photo Condition Assessment', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 40;
    
    // Add description
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.colors.text);
    this.doc.text('Our AI system has analyzed the vehicle photos to assess the condition:', this.margin, this.currentY);
    this.currentY += 30;
    
    // Photo placeholder
    if (this.data.bestPhotoUrl) {
      this.doc.setFillColor('#EEEEEE');
      this.doc.rect(this.margin, this.currentY, 200, 150, 'F');
      this.doc.setTextColor('#999999');
      this.doc.text('Vehicle Photo', this.margin + 100, this.currentY + 75, { align: 'center' });
      this.currentY += 170;
    }
    
    // Assessment summary
    this.doc.setFontSize(14);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Condition Assessment', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 25;
    
    this.doc.setFillColor(this.colors.background);
    this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 100, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.colors.text);
    
    // Overall condition
    this.doc.setFont(this.fonts.bold);
    this.doc.text('Overall Condition:', this.margin + 10, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.doc.text(this.data.aiCondition.condition || 'Unknown', this.margin + 150, this.currentY);
    this.currentY += 25;
    
    // Confidence
    this.doc.setFont(this.fonts.bold);
    this.doc.text('AI Confidence:', this.margin + 10, this.currentY);
    this.doc.setFont(this.fonts.regular);
    
    const confidenceValue = this.data.aiCondition.confidenceScore || 
                           this.data.aiCondition.confidence || 0;
    
    let confidenceText = 'Unknown';
    if (typeof confidenceValue === 'number') {
      confidenceText = `${confidenceValue}%`;
    } else if (typeof confidenceValue === 'string') {
      confidenceText = confidenceValue;
    }
    
    this.doc.text(confidenceText, this.margin + 150, this.currentY);
    this.currentY += 25;
    
    // Photo score if available
    if (this.data.photoScore) {
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Photo Quality Score:', this.margin + 10, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.doc.text(`${this.data.photoScore}/10`, this.margin + 150, this.currentY);
      this.currentY += 25;
    }
    
    // Issues detected
    const issues = this.data.aiCondition.issuesDetected || 
                  this.data.aiCondition.issues || [];
    
    if (Array.isArray(issues) && issues.length > 0) {
      this.currentY += 10;
      
      this.doc.setFontSize(14);
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Issues Detected', this.margin, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.currentY += 25;
      
      this.doc.setFillColor(this.colors.background);
      this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 25 * issues.length + 10, 'F');
      
      this.doc.setFontSize(12);
      
      issues.forEach((issue, index) => {
        this.doc.text(`• ${issue}`, this.margin + 10, this.currentY + (index * 25));
      });
      
      this.currentY += 25 * issues.length + 20;
    }
    
    // Assessment summary
    if (this.data.aiCondition.summary) {
      this.doc.setFontSize(14);
      this.doc.setFont(this.fonts.bold);
      this.doc.text('Assessment Summary', this.margin, this.currentY);
      this.doc.setFont(this.fonts.regular);
      this.currentY += 25;
      
      this.doc.setFillColor(this.colors.background);
      this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 100, 'F');
      
      this.doc.setFontSize(12);
      
      // Split summary into lines to fit the width
      const maxWidth = this.contentWidth - 20;
      const summaryLines = this.doc.splitTextToSize(this.data.aiCondition.summary, maxWidth);
      
      summaryLines.forEach((line: string, index: number) => {
        this.doc.text(line, this.margin + 10, this.currentY + (index * 20));
      });
    }
  }
  
  /**
   * Add explanation section if included
   */
  private addExplanation(): void {
    if (!this.data.explanation) return;
    
    // Add page title
    this.doc.setFontSize(20);
    this.doc.setFont(this.fonts.bold);
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('Valuation Explanation', this.margin, this.currentY);
    this.doc.setFont(this.fonts.regular);
    this.currentY += 40;
    
    // Add description
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.colors.text);
    this.doc.text('How we calculated this valuation:', this.margin, this.currentY);
    this.currentY += 30;
    
    this.doc.setFillColor(this.colors.background);
    this.doc.rect(this.margin, this.currentY - 15, this.contentWidth, 400, 'F');
    
    // Split explanation into lines to fit the width
    const maxWidth = this.contentWidth - 20;
    const explanationLines = this.doc.splitTextToSize(this.data.explanation, maxWidth);
    
    explanationLines.forEach((line: string, index: number) => {
      this.doc.text(line, this.margin + 10, this.currentY + (index * 20));
    });
  }
  
  /**
   * Add footer to all pages
   */
  private addFooterToAllPages(): void {
    const totalPages = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      
      // Add page number
      this.doc.setFontSize(10);
      this.doc.setTextColor(this.colors.text);
      this.doc.text(`Page ${i} of ${totalPages}`, this.pageWidth / 2, this.pageHeight - 20, { align: 'center' });
      
      // Add footer line
      this.doc.setDrawColor(this.colors.primary);
      this.doc.line(this.margin, this.pageHeight - 30, this.pageWidth - this.margin, this.pageHeight - 30);
      
      // Add branding if included
      if (this.options.includeBranding) {
        this.doc.setFontSize(8);
        this.doc.text('Generated by Car Detective', this.margin, this.pageHeight - 10);
        
        // Add website if available
        if (this.data.website) {
          this.doc.text(this.data.website, this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' });
        }
      }
      
      // Add disclaimer text if available
      if (this.data.disclaimerText) {
        this.doc.setFontSize(6);
        this.doc.setFont(this.fonts.italic || this.fonts.regular);
        this.doc.text(this.data.disclaimerText, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
        this.doc.setFont(this.fonts.regular);
      }
    }
  }
  
  /**
   * Add watermark if specified
   */
  private addWatermark(): void {
    const totalPages = this.doc.getNumberOfPages();
    const watermarkText = typeof this.options.watermark === 'string' ? this.options.watermark : 'SAMPLE';
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      
      this.doc.setFontSize(60);
      this.doc.setTextColor(230, 230, 230); // Light gray
      this.doc.setFont(this.fonts.bold);
      
      // Rotate and position the watermark
      this.doc.saveGraphicsState();
      this.doc.translate(this.pageWidth / 2, this.pageHeight / 2);
      this.doc.rotate(-45 * Math.PI / 180);
      this.doc.text(watermarkText, 0, 0, { align: 'center' });
      this.doc.restoreGraphicsState();
      
      this.doc.setFont(this.fonts.regular);
      this.doc.setTextColor(this.colors.text);
    }
  }
  
  /**
   * Get color for confidence score
   */
  private getConfidenceColor(score: number): string {
    if (score >= 90) return '#4CAF50'; // Green
    if (score >= 70) return '#8BC34A'; // Light green
    if (score >= 50) return '#FFC107'; // Amber
    if (score >= 30) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }
}

/**
 * Generate a premium PDF report
 * @param data The report data
 * @param options Options for PDF generation
 * @returns Promise resolving to Uint8Array containing the PDF
 */
export async function generatePremiumPdf(
  data: ReportData, 
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  // Set default options
  const defaultOptions: ReportOptions = {
    includeBranding: true,
    includeExplanation: true,
    includePhotoAssessment: true,
    watermark: false,
    fontSize: 12,
    pdfQuality: 'high',
    isPremium: true
  };
  
  // Merge options
  const mergedOptions: ReportOptions = { ...defaultOptions, ...options };
  
  // Create premium report generator
  const generator = new PremiumReportGenerator(data, mergedOptions);
  
  // Generate and return the PDF
  return await generator.generate();
}
