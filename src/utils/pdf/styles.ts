
import { rgb, PDFPage, RGB } from 'pdf-lib';

export interface PdfStyles {
  colors: {
    primary: RGB;
    secondary: RGB;
    text: RGB;
    textSecondary: RGB;
    background: RGB;
    backgroundSecondary: RGB;
    accent: RGB;
    error: RGB;
    success: RGB;
    warning: RGB;
    border: RGB;
    highlight: RGB;
    premium: RGB;
  };
  sizes: {
    headingLarge: number;
    headingMedium: number;
    headingSmall: number;
    body: number;
    caption: number;
  };
  spacing: {
    margin: number;
    padding: number;
    sectionGap: number;
    lineHeight: number;
  };
}

// Create MVP design compliant styles
export const mvpPdfStyles: PdfStyles = {
  colors: {
    primary: rgb(0.608, 0.529, 0.961), // #9b87f5
    secondary: rgb(0.494, 0.412, 0.671), // #7E69AB
    text: rgb(0.102, 0.122, 0.173), // #1A1F2C
    textSecondary: rgb(0.557, 0.569, 0.588), // #8E9196
    background: rgb(1, 1, 1), // #FFFFFF
    backgroundSecondary: rgb(0.945, 0.941, 0.984), // #F1F0FB
    accent: rgb(0.545, 0.361, 0.965), // #8B5CF6
    error: rgb(0.918, 0.22, 0.298), // #ea384c
    success: rgb(0.039, 0.647, 0.408), // #0AA568
    warning: rgb(0.976, 0.453, 0.086), // #F97316
    border: rgb(0.784, 0.784, 0.784), // #C8C8C9
    highlight: rgb(0.898, 0.867, 1), // #E5DEFF
    premium: rgb(0.988, 0.776, 0.055), // #FCB60E
  },
  sizes: {
    headingLarge: 24,
    headingMedium: 18,
    headingSmall: 14,
    body: 11,
    caption: 9,
  },
  spacing: {
    margin: 50,
    padding: 20,
    sectionGap: 25,
    lineHeight: 15,
  }
};

// Draw styled section heading
export function drawStyledHeading(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: any,
  color: RGB = mvpPdfStyles.colors.primary
): number {
  page.drawText(text, {
    x,
    y,
    size,
    font,
    color
  });
  
  // Draw an underline
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawLine({
    start: { x, y: y - 5 },
    end: { x: x + textWidth, y: y - 5 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  
  return y - (size + 10); // Return the new Y position
}

// Draw styled box with title
export function drawStyledBox(
  page: PDFPage,
  title: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontBold: any,
  fontRegular: any
): number {
  // Draw box
  page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: mvpPdfStyles.colors.backgroundSecondary,
    borderColor: mvpPdfStyles.colors.border,
    borderWidth: 1,
    opacity: 0.9,
  });
  
  // Draw title
  page.drawText(title, {
    x: x + 10,
    y: y - 20,
    size: mvpPdfStyles.sizes.headingSmall,
    font: fontBold,
    color: mvpPdfStyles.colors.primary
  });
  
  return y - height; // Return the new Y position
}

// Draw premium badge
export function drawPremiumBadge(
  page: PDFPage,
  x: number,
  y: number,
  font: any
): void {
  // Draw badge background
  page.drawRectangle({
    x,
    y: y - 25,
    width: 100,
    height: 25,
    color: mvpPdfStyles.colors.premium,
    borderColor: rgb(0.988, 0.6, 0.055),
    borderWidth: 1,
    opacity: 0.9,
  });
  
  // Draw badge text
  page.drawText('PREMIUM', {
    x: x + 20,
    y: y - 15,
    size: 12,
    font: font,
    color: rgb(0.4, 0.2, 0)
  });
}
