
import { supabase } from '@/integrations/supabase/client';
import { openai } from '@/integrations/openai/client';

interface TrimData {
  id: string;
  trim_name: string;
  year: number;
  msrp: number | null;
  models: {
    model_name: string;
    makes: {
      make_name: string;
    }[];
  }[];
}

function extractPrice(text: string): number | null {
  // Look for dollar amounts with commas
  const pricePatterns = [
    /\$(\d{1,3}(?:,\d{3})*)/g,
    /(\d{1,3}(?:,\d{3})*)\s*dollars?/gi,
    /MSRP.*?\$(\d{1,3}(?:,\d{3})*)/gi,
    /price.*?\$(\d{1,3}(?:,\d{3})*)/gi,
    /starting.*?\$(\d{1,3}(?:,\d{3})*)/gi
  ];

  for (const pattern of pricePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const numStr = match.replace(/[^\d,]/g, '').replace(/,/g, '');
        const price = parseInt(numStr, 10);
        
        // Validate reasonable MSRP range
        if (price >= 15000 && price <= 300000) {
          return price;
        }
      }
    }
  }

  return null;
}

export async function populateMsrpsFromWebSearch(): Promise<void> {
  console.warn('❌ This client-side script is disabled. Use server-side implementation instead.');
  return;

}

// Export for use in other modules
export default populateMsrpsFromWebSearch;
