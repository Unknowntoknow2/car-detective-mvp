
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  platform: string;
  location: string;
  url: string;
  mileage?: number;
  created_at: string;
}

interface InjectMarketplaceOptions {
  pdfBytes: Uint8Array;
  listings: MarketplaceListing[];
  estimatedValue: number;
  maxListings?: number;
}

export async function injectMarketplaceListingsToPDF({
  pdfBytes,
  listings,
  estimatedValue,
  maxListings = 5
}: InjectMarketplaceOptions): Promise<Uint8Array> {
  if (!listings || listings.length === 0) {
    return pdfBytes; // Return original PDF if no listings
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  const { height } = lastPage.getSize();
  
  // Add a new page for marketplace listings
  const newPage = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let currentY = height - 50;
  const pageWidth = 550;
  const leftMargin = 50;
  
  // Title
  newPage.drawText('Public Marketplace Listings', {
    x: leftMargin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  currentY -= 30;
  
  // Subtitle with comparison
  const averagePrice = listings.reduce((sum, listing) => sum + listing.price, 0) / listings.length;
  const comparison = estimatedValue > averagePrice ? 'above' : 'below';
  const difference = Math.abs(estimatedValue - averagePrice);
  const percentDiff = ((difference / averagePrice) * 100).toFixed(1);
  
  newPage.drawText(
    `Found ${listings.length} similar listings. Your valuation is ${percentDiff}% ${comparison} market average.`,
    {
      x: leftMargin,
      y: currentY,
      size: 11,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    }
  );
  
  currentY -= 40;
  
  // Filter and sort listings - take best ones by price and recency
  const sortedListings = listings
    .filter(listing => listing.price > 0)
    .sort((a, b) => {
      // Sort by price proximity to estimated value, then by recency
      const aDiff = Math.abs(a.price - estimatedValue);
      const bDiff = Math.abs(b.price - estimatedValue);
      if (aDiff !== bDiff) return aDiff - bDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, maxListings);
  
  // Render each listing
  sortedListings.forEach((listing, index) => {
    if (currentY < 100) {
      // Add new page if running out of space
      const additionalPage = pdfDoc.addPage();
      currentY = height - 50;
    }
    
    // Platform badge background
    const badgeWidth = 80;
    const badgeHeight = 20;
    newPage.drawRectangle({
      x: leftMargin,
      y: currentY - 15,
      width: badgeWidth,
      height: badgeHeight,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    // Platform name
    newPage.drawText(listing.platform.toUpperCase(), {
      x: leftMargin + 5,
      y: currentY - 8,
      size: 9,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Price (right aligned)
    const priceText = `$${listing.price.toLocaleString()}`;
    const priceWidth = font.widthOfTextAtSize(priceText, 14);
    newPage.drawText(priceText, {
      x: leftMargin + pageWidth - priceWidth - 50,
      y: currentY - 8,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.6, 0.1)
    });
    
    currentY -= 25;
    
    // Title (truncate if too long)
    const maxTitleLength = 70;
    const displayTitle = listing.title.length > maxTitleLength 
      ? listing.title.substring(0, maxTitleLength) + '...'
      : listing.title;
    
    newPage.drawText(displayTitle, {
      x: leftMargin,
      y: currentY,
      size: 11,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    currentY -= 18;
    
    // Location and mileage
    let detailsText = listing.location || 'Location not specified';
    if (listing.mileage) {
      detailsText += ` • ${listing.mileage.toLocaleString()} miles`;
    }
    
    newPage.drawText(detailsText, {
      x: leftMargin,
      y: currentY,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    // Price comparison indicator
    const priceDiff = listing.price - estimatedValue;
    const priceDiffPercent = ((priceDiff / estimatedValue) * 100).toFixed(1);
    const comparisonText = priceDiff > 0 
      ? `+${priceDiffPercent}% vs your valuation`
      : `${priceDiffPercent}% vs your valuation`;
    const comparisonColor = priceDiff > 0 ? rgb(0.8, 0.2, 0.2) : rgb(0.1, 0.6, 0.1);
    
    newPage.drawText(comparisonText, {
      x: leftMargin + pageWidth - 200,
      y: currentY,
      size: 9,
      font: font,
      color: comparisonColor
    });
    
    currentY -= 30;
    
    // Separator line
    if (index < sortedListings.length - 1) {
      newPage.drawLine({
        start: { x: leftMargin, y: currentY + 5 },
        end: { x: leftMargin + pageWidth - 50, y: currentY + 5 },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8)
      });
      currentY -= 10;
    }
  });
  
  // Footer note
  currentY -= 30;
  newPage.drawText(
    'Note: Listings are sourced from public marketplaces and filtered for relevance. Prices may vary.',
    {
      x: leftMargin,
      y: Math.max(currentY, 30),
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6)
    }
  );
  
  return pdfDoc.save();
}

// Helper function to format marketplace data for PDF injection
export function formatListingsForPDF(listings: MarketplaceListing[]): MarketplaceListing[] {
  return listings
    .filter(listing => listing.price && listing.price > 0)
    .map(listing => ({
      ...listing,
      title: listing.title.trim(),
      platform: listing.platform || 'Unknown',
      location: listing.location || 'Location not specified'
    }));
}
