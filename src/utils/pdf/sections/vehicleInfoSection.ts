<<<<<<< HEAD

import { SectionParams } from '../types';

export function drawVehicleInfoSection(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
=======
import { PDFPage, rgb } from "pdf-lib";
import { ReportData, SectionParams } from "../types";

export const drawVehicleInfoSection = (
  params: SectionParams,
  reportData: ReportData,
): number => {
  const { page, y, margin, width, regularFont, boldFont } = params;
  let currentY = y - 20;

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  // Draw section title
  page.drawText("Vehicle Information", {
    x: margin,
    y,
    size: 14,
<<<<<<< HEAD
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw vehicle name
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  y -= 20;
  
  // Draw vehicle details in a table format
  const drawDetail = (label: string, value: string) => {
    page.drawText(label, {
      x: margin,
      y,
      size: 9,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(value, {
      x: margin + 120,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  };
  
  // Mileage
  if (data.mileage) {
    drawDetail('Mileage:', `${data.mileage.toLocaleString()} miles`);
  }
  
  // VIN
  if (data.vin) {
    drawDetail('VIN:', data.vin);
  }
  
  // Condition
  if (data.condition) {
    drawDetail('Condition:', data.condition);
  }
  
  // Location
  if (data.zipCode) {
    drawDetail('Location:', `ZIP: ${data.zipCode}`);
  }
  
  y -= 10; // Add some space after the table
  
  return y; // Return the new Y position
}
=======
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY -= 30;

  // Draw make and model
  page.drawText("Make / Model:", {
    x: margin,
    y: currentY,
    size: 11,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`${reportData.make} ${reportData.model}`, {
    x: margin + width / 3,
    y: currentY,
    size: 11,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY -= 20;

  // Draw year
  page.drawText("Year:", {
    x: margin,
    y: currentY,
    size: 11,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`${reportData.year}`, {
    x: margin + width / 3,
    y: currentY,
    size: 11,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY -= 20;

  // Draw mileage if available
  if (reportData.mileage) {
    page.drawText("Mileage:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(`${reportData.mileage.toLocaleString()} miles`, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY -= 20;
  }

  // Draw vin if available
  if (reportData.vin) {
    page.drawText("VIN:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(reportData.vin, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY -= 20;
  }

  // Draw condition if available
  if (reportData.condition) {
    page.drawText("Condition:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(reportData.condition, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY -= 20;
  }

  // Draw color if available
  if (reportData.color) {
    page.drawText("Color:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(reportData.color, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY -= 20;
  }

  // Draw fuel type if available
  if (reportData.fuelType) {
    page.drawText("Fuel Type:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(reportData.fuelType, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY -= 20;
  }

  // Draw transmission if available
  if (reportData.transmission) {
    page.drawText("Transmission:", {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(reportData.transmission, {
      x: margin + width / 3,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY -= 20;
  }

  return currentY;
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
