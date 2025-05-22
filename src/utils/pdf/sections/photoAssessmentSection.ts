
import { SectionParams } from '../types';
import { safeString } from './sectionHelper';

export const drawPhotoAssessmentSection = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  const photoUrl = data.photoUrl || data.bestPhotoUrl;
  const photoScore = data.photoScore;
  
  if (!photoUrl) {
    return doc.y;
  }
  
  // Start position
  const startY = doc.y + 20;
  
  // Draw section title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Vehicle Photo Analysis', margin, startY);
  
  // Add some spacing
  let currentY = startY + 30;
  
  // Check if we have an image to show
  if (photoUrl) {
    try {
      // Add the photo
      doc.image(photoUrl, margin, currentY, {
        width: 300,
        height: 200,
        fit: [300, 200],
        align: 'center'
      });
      
      currentY += 220; // Move position below the image
    } catch (error) {
      console.error('Error adding photo to PDF:', error);
      doc.fontSize(10)
         .font('Helvetica-Italic')
         .text('Error loading vehicle photo', margin, currentY);
      
      currentY += 20;
    }
  }
  
  // Add photo score if available
  if (photoScore !== undefined) {
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Photo Score:', margin, currentY);
    
    doc.fontSize(12)
       .font('Helvetica')
       .text(`${photoScore}/10`, margin + 100, currentY);
    
    currentY += 20;
  }
  
  // Add AI condition if available
  if (data.aiCondition) {
    const aiCondition = data.aiCondition;
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('AI Condition Assessment:', margin, currentY);
    
    currentY += 20;
    
    // Add summary
    if (aiCondition.summary) {
      doc.fontSize(10)
         .font('Helvetica')
         .text(aiCondition.summary, margin, currentY, {
           width: doc.page.width - (margin * 2)
         });
      
      currentY = doc.y + 10;
    }
    
    // Add confidence score
    if (aiCondition.confidenceScore) {
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Confidence Score: ${aiCondition.confidenceScore}%`, margin, currentY);
      
      currentY += 15;
    }
    
    // Add issues detected
    if (aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Issues Detected:', margin, currentY);
      
      currentY += 15;
      
      aiCondition.issuesDetected.forEach((issue: string) => {
        doc.fontSize(9)
           .font('Helvetica')
           .text(`• ${issue}`, margin + 10, currentY);
        
        currentY += 12;
      });
    }
  }
  
  return currentY + 10;
};
