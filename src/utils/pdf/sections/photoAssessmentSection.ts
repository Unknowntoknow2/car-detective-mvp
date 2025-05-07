
import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import { ReportData } from '../types';

/**
 * Adds a photo assessment section to the PDF
 */
export async function addPhotoAssessmentSection(
  page: PDFPage,
  document: PDFDocument,
  data: ReportData,
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont },
  currentPosition: number,
  width: number,
): Promise<number> {
  // Skip if no photo or explanation
  if (!data.bestPhotoUrl) {
    return currentPosition;
  }

  // Add section title
  const titleHeight = addTitle(page, fonts, currentPosition, width);
  currentPosition -= titleHeight + 15;

  // Try to embed the photo
  try {
    // For the prototype, we'd need to fetch the image first
    // In a real implementation, we'd need to fetch the image from the URL
    // For now, this is a placeholder for the final implementation
    const photoData = await fetchImageAsBytes(data.bestPhotoUrl);
    
    if (photoData) {
      const photoHeight = await addPhoto(page, document, photoData, currentPosition, width);
      currentPosition -= photoHeight + 15;
    }
  } catch (error) {
    console.error('Error embedding photo in PDF:', error);
    
    // Add a placeholder text if photo embedding fails
    page.drawText('(Photo could not be embedded)', {
      x: 50,
      y: currentPosition - 30,
      size: 10,
      font: fonts.italic,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    currentPosition -= 40;
  }

  // Add explanation if available
  if (data.photoExplanation) {
    const explanationHeight = addExplanation(
      page, 
      fonts, 
      data.photoExplanation, 
      currentPosition, 
      width
    );
    currentPosition -= explanationHeight + 20;
  }

  return currentPosition;
}

/**
 * Adds the section title
 */
function addTitle(
  page: PDFPage,
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont },
  y: number,
  width: number,
): number {
  const title = 'AI Photo Assessment';
  
  page.drawText(title, {
    x: 50,
    y,
    size: 16,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.4),
  });
  
  // Add divider line
  page.drawLine({
    start: { x: 50, y: y - 10 },
    end: { x: width - 50, y: y - 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  return 20; // Title height
}

/**
 * Fetches an image from a URL and returns it as bytes
 * This is a placeholder - in a real implementation, you'd use a proper HTTP library
 */
async function fetchImageAsBytes(url: string): Promise<Uint8Array | null> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

/**
 * Adds the photo to the PDF
 */
async function addPhoto(
  page: PDFPage,
  document: PDFDocument,
  photoBytes: Uint8Array,
  y: number,
  width: number,
): Promise<number> {
  try {
    // Determine if the image is JPEG or PNG
    const isJpeg = photoBytes[0] === 0xFF && photoBytes[1] === 0xD8;
    const isPng = photoBytes[0] === 0x89 && photoBytes[1] === 0x50 && photoBytes[2] === 0x4E && photoBytes[3] === 0x47;
    
    let image;
    if (isJpeg) {
      image = await document.embedJpg(photoBytes);
    } else if (isPng) {
      image = await document.embedPng(photoBytes);
    } else {
      throw new Error('Unsupported image format');
    }
    
    // Calculate dimensions to maintain aspect ratio
    const maxWidth = width - 100; // 50px margin on each side
    const maxHeight = 200; // Maximum height for the photo
    
    const aspectRatio = image.width / image.height;
    
    let photoWidth = maxWidth;
    let photoHeight = photoWidth / aspectRatio;
    
    if (photoHeight > maxHeight) {
      photoHeight = maxHeight;
      photoWidth = photoHeight * aspectRatio;
    }
    
    // Center the image
    const x = 50 + (maxWidth - photoWidth) / 2;
    
    // Draw the image
    page.drawImage(image, {
      x,
      y: y - photoHeight,
      width: photoWidth,
      height: photoHeight,
    });
    
    return photoHeight;
  } catch (error) {
    console.error('Error embedding image in PDF:', error);
    return 0;
  }
}

/**
 * Adds the AI explanation to the PDF
 */
function addExplanation(
  page: PDFPage,
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont },
  explanation: string,
  y: number,
  width: number,
): number {
  // Add explanation title
  page.drawText('AI Visual Assessment:', {
    x: 50,
    y,
    size: 12,
    font: fonts.bold,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  // Add explanation text
  const maxWidth = width - 100;
  const fontSize = 10;
  const lineHeight = 14;
  
  const words = explanation.split(' ');
  let line = '';
  let currentY = y - 20;
  let lineCount = 0;
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const testLineWidth = fonts.regular.widthOfTextAtSize(testLine, fontSize);
    
    if (testLineWidth > maxWidth && line !== '') {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: fontSize,
        font: fonts.regular,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      line = word;
      currentY -= lineHeight;
      lineCount++;
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: 50,
      y: currentY,
      size: fontSize,
      font: fonts.regular,
      color: rgb(0.3, 0.3, 0.3),
    });
    lineCount++;
  }
  
  return 20 + (lineHeight * lineCount); // Title height + lines
}
