import { createClient } from '@supabase/supabase-js';

export interface TitleRecallInfo {
  titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Lemon' | 'Flood' | 'Stolen' | 'Unknown';
  brandedDetails?: string;
  recalls: {
    id: string;
    component: string;
    summary: string;
    riskLevel: 'Critical' | 'Important' | 'Informational';
    recallDate: string;
    resolved?: boolean;
  }[];
  oemRepairLinks?: string[];
  lastChecked: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function fetchVehicleTitlesAndRecalls(
  vin: string,
  year: number,
  make: string,
  model: string
): Promise<TitleRecallInfo> {
  try {
    console.log('Fetching title and recall data for VIN:', vin);

    // Generate prompts for OpenAI web search
    const titlePrompt = generateTitlePrompt(vin);
    const recallPrompt = generateRecallPrompt(vin, year, make, model);

    // Call OpenAI web search via Supabase Edge Function
    const [titleResponse, recallResponse] = await Promise.all([
      searchTitleStatus(titlePrompt),
      searchRecallStatus(recallPrompt),
    ]);

    const result: TitleRecallInfo = {
      titleStatus: titleResponse.titleStatus || 'Unknown',
      brandedDetails: titleResponse.brandedDetails,
      recalls: recallResponse.recalls || [],
      oemRepairLinks: recallResponse.oemRepairLinks,
      lastChecked: new Date().toISOString(),
    };

    console.log('Title and recall data fetched:', result);
    return result;
  } catch (error) {
    console.error('Error fetching title and recall data:', error);
    return {
      titleStatus: 'Unknown',
      recalls: [],
      lastChecked: new Date().toISOString(),
    };
  }
}

function generateTitlePrompt(vin: string): string {
  return `Query title status for VIN ${vin}. Search NICB VINCheck, NMVTIS, and other reputable sources. Return JSON with:
- titleStatus: (Clean, Salvage, Rebuilt, Flood, Lemon, Stolen, Unknown)
- brandedDetails: explanation of any title branding
- source: data source used
- brandingDate: when title was branded (if applicable)
- brandingLocation: where title was branded (if applicable)

Focus on accurate, verifiable information only.`;
}

function generateRecallPrompt(vin: string, year: number, make: string, model: string): string {
  return `Check NHTSA recalls and manufacturer databases for ${year} ${make} ${model} VIN ${vin}. Return JSON with:
- recalls: array of recall objects with:
  - id: recall number
  - component: affected part/system
  - summary: brief description
  - riskLevel: (Critical, Important, Informational)
  - recallDate: when recall was issued
  - resolved: whether repair completed (if determinable)
- oemRepairLinks: URLs to manufacturer repair scheduling

Only return verified, official recall information.`;
}

async function searchTitleStatus(prompt: string) {
  try {
    const { data, error } = await supabase.functions.invoke('openai-web-search', {
      body: { prompt }
    });

    if (error) throw error;

    // Parse OpenAI response and extract title status
    const response = data?.choices?.[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        titleStatus: parsed.titleStatus || 'Unknown',
        brandedDetails: parsed.brandedDetails,
        source: parsed.source,
      };
    } catch {
      // Fallback: extract key information from text response
      const titleStatus = extractTitleStatusFromText(response);
      return {
        titleStatus,
        brandedDetails: response.includes('salvage') || response.includes('flood') ? response : undefined,
      };
    }
  } catch (error) {
    console.error('Error searching title status:', error);
    return { titleStatus: 'Unknown' };
  }
}

async function searchRecallStatus(prompt: string) {
  try {
    const { data, error } = await supabase.functions.invoke('openai-web-search', {
      body: { prompt }
    });

    if (error) throw error;

    const response = data?.choices?.[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        recalls: parsed.recalls || [],
        oemRepairLinks: parsed.oemRepairLinks || [],
      };
    } catch {
      // Fallback: extract recall information from text
      const recalls = extractRecallsFromText(response);
      return { recalls };
    }
  } catch (error) {
    console.error('Error searching recall status:', error);
    return { recalls: [] };
  }
}

function extractTitleStatusFromText(text: string): TitleRecallInfo['titleStatus'] {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('salvage')) return 'Salvage';
  if (lowerText.includes('rebuilt')) return 'Rebuilt';
  if (lowerText.includes('flood')) return 'Flood';
  if (lowerText.includes('lemon')) return 'Lemon';
  if (lowerText.includes('stolen') || lowerText.includes('theft')) return 'Stolen';
  if (lowerText.includes('clean') || lowerText.includes('clear')) return 'Clean';
  
  return 'Unknown';
}

function extractRecallsFromText(text: string): TitleRecallInfo['recalls'] {
  const recalls: TitleRecallInfo['recalls'] = [];
  
  // Simple extraction - look for recall patterns
  const recallPatterns = [
    /recall\s+#?(\w+)/gi,
    /nhtsa\s+(\w+)/gi,
    /campaign\s+(\w+)/gi,
  ];
  
  recallPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match, index) => {
        recalls.push({
          id: match,
          component: 'Unknown',
          summary: 'Recall identified in search results',
          riskLevel: 'Informational',
          recallDate: new Date().toISOString().split('T')[0],
        });
      });
    }
  });
  
  return recalls.slice(0, 5); // Limit to 5 recalls
}