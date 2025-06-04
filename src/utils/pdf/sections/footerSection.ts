<<<<<<< HEAD

import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawFooterSection(params: SectionParams): void {
  const { page, margin, width, fonts, textColor, options } = params;
  
  const { height } = page.getSize();
  const footerY = 20; // 20 points from bottom
  
  // Draw a thin line above the footer
=======
// ✅ TS check passed
import { rgb } from "pdf-lib";
import { SectionParams } from "../types";
import { RotationTypes } from "pdf-lib";

/**
 * Helper function to create a proper rotation object
 * @param angle The angle in degrees
 * @returns A properly formatted rotation object
 */
function degrees(angle: number) {
  return {
    type: RotationTypes.Degrees,
    angle,
  };
}

/**
 * Draws the footer section of the PDF
 * @param params Section parameters including page and fonts
 * @param includeTimestamp Whether to include timestamp in footer
 * @param currentPage Current page number
 * @param totalPages Total number of pages
 * @param includeWatermark Whether to include watermark in footer
 */
export function drawFooterSection(
  params: SectionParams,
  includeTimestamp: boolean = true,
  currentPage: number = 1,
  totalPages: number = 1,
  includeWatermark: boolean = true,
): void {
  const { page, width, height, margin, regularFont, contentWidth } = params;

  // Draw separator line
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
<<<<<<< HEAD
  
  // Draw copyright text
  const copyrightText = '© ' + new Date().getFullYear() + ' Car Detective - All Rights Reserved';
  
  page.drawText(copyrightText, {
=======

  // Draw Car Detective logo/text
  page.drawText("Car Detective™", {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    x: margin,
    y: footerY,
    size: 8,
    font: fonts.regular,
    color: textColor,
    opacity: 0.7,
  });
<<<<<<< HEAD
  
  // Draw page number on the right
  const pageText = 'Page 1';
  const pageTextWidth = fonts.regular.widthOfTextAtSize(pageText, 8);
  
=======

  // Draw confidentiality notice
  if (includeWatermark) {
    page.drawText("Confidential - For authorized use only", {
      x: margin + 150,
      y: margin + 20,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // Draw date and time if requested
  if (includeTimestamp) {
    const now = new Date();
    const dateString = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    page.drawText(`Generated: ${dateString}`, {
      x: margin,
      y: margin + 8,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // Draw page numbers
  const pageText = `Page ${currentPage} of ${totalPages}`;
  const pageTextWidth = regularFont.widthOfTextAtSize(pageText, 8);

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  page.drawText(pageText, {
    x: width - margin - pageTextWidth,
    y: footerY,
    size: 8,
<<<<<<< HEAD
    font: fonts.regular,
    color: textColor,
    opacity: 0.7,
=======
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });
}

/**
 * Draws a watermarked footer with branded disclaimer
 * @param params Section parameters including page and fonts
 * @param companyName Company name to include in disclaimer
 * @param color Color for the footer text
 * @param currentPage Current page number (default: 1)
 * @param totalPages Total number of pages (default: 1)
 */
export function drawWatermarkedFooter(
  params: SectionParams,
  companyName: string,
  color: { r: number; g: number; b: number },
  currentPage: number = 1,
  totalPages: number = 1,
): void {
  const { page, width, height, margin, regularFont } = params;

  // Create disclaimer text
  const disclaimer = `© ${
    new Date().getFullYear()
  } ${companyName}. All rights reserved.`;

  // Draw disclaimer at an angle
  page.drawText(disclaimer, {
    x: width / 2 - 100,
    y: 20,
    size: 8,
    font: regularFont,
    color: rgb(color.r, color.g, color.b),
    opacity: 0.6,
    rotate: {
      type: RotationTypes.Degrees,
      angle: 10,
    },
  });

  // Add page numbers
  const pageText = `Page ${currentPage} of ${totalPages}`;
  page.drawText(pageText, {
    x: width - margin - 100,
    y: margin,
    size: 8,
    font: regularFont,
    color: rgb(color.r, color.g, color.b),
    opacity: 0.8,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
}
