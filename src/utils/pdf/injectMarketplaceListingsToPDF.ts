
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
  source?: string;
}

interface InjectParams {
  pdfBytes: Uint8Array;
  listings: MarketplaceListing[];
  estimatedValue: number;
  maxListings?: number;
}

/**
 * Formats a price value into a currency string
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Injects marketplace listings into an existing PDF document
 * @param params Parameters including PDF bytes, listings, and options
 * @returns Modified PDF as Uint8Array
 */
export async function injectMarketplaceListingsToPDF({
  pdfBytes,
  listings,
  estimatedValue,
  maxListings = 5
}: InjectParams): Promise<Uint8Array> {
  try {
    console.log('Starting PDF injection with', listings.length, 'listings');
    
    if (!listings || listings.length === 0) {
      console.log('No listings to inject, returning original PDF');
      return pdfBytes;
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const titleFontSize = 16;
    const xStart = 50;
    let y = height - 400;

    // Section Title
    page.drawText('📊 Public Listings (Craigslist, Facebook, etc.)', {
      x: xStart,
      y,
      size: titleFontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 30;

    // Inject up to maxListings
    const listingsToShow = listings.slice(0, maxListings);
    listingsToShow.forEach((listing, index) => {
      const source = listing.source || listing.platform || 'Unknown';
      const line = `${index + 1}. ${source} — ${listing.title} — ${formatPrice(listing.price)} — ${listing.location}`;
      
      page.drawText(line, {
        x: xStart,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= 22;
    });

    // Add summary if we have listings
    if (listingsToShow.length > 0) {
      const averagePrice = listingsToShow.reduce((sum, listing) => sum + listing.price, 0) / listingsToShow.length;
      const summaryText = `Average marketplace price: ${formatPrice(averagePrice)} (based on ${listingsToShow.length} listings)`;
      
      y -= 10;
      page.drawText(summaryText, {
        x: xStart,
        y,
        size: fontSize - 1,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    console.log('PDF injection completed successfully');
    return modifiedPdfBytes;
    
  } catch (error) {
    console.error('Error injecting marketplace listings into PDF:', error);
    // Return original PDF if injection fails
    return pdfBytes;
  }
}
