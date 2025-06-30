
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
    };
  } | null;
}

function extractPrice(text: string): number | null {
  // Look for dollar amounts with commas
  const pricePatterns = [
    /\$(\d{1,3}(?:,\d{3})*)/g,
    /(\d{1,3}(?:,\d{3})*)\s*dollars?/gi,
    /MSRP.*?\$(\d{1,3}(?:,\d{3})*)/gi,
    /price.*?\$(\d{1,3}(?:,\d{3})*)/gi
  ];

  for (const pattern of pricePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const numStr = match.replace(/[^\d,]/g, '').replace(/,/g, '');
        const price = parseInt(numStr, 10);
        
        // Validate reasonable MSRP range
        if (price >= 15000 && price <= 200000) {
          return price;
        }
      }
    }
  }

  return null;
}

export async function populateMsrpsFromWebSearch(): Promise<void> {
  console.log('🚀 Starting MSRP population from web search...');

  try {
    const { data: trims, error } = await supabase
      .from('model_trims')
      .select(`
        id, 
        trim_name, 
        year, 
        msrp,
        models!inner (
          model_name,
          makes!inner (
            make_name
          )
        )
      `)
      .is('msrp', null) // Only get rows without MSRP
      .limit(50); // Limit to avoid rate limits in initial run

    if (error) {
      console.error('❌ Failed to load model_trims:', error);
      return;
    }

    if (!trims || trims.length === 0) {
      console.log('✅ No rows need MSRP population');
      return;
    }

    console.log(`📊 Found ${trims.length} trims to populate`);

    let successCount = 0;
    let failCount = 0;

    for (const row of trims as TrimData[]) {
      const { id, year, trim_name, msrp } = row;
      const make = row.models?.makes?.make_name;
      const model = row.models?.model_name;

      if (!make || !model || msrp) {
        console.log(`⏭️ Skipping incomplete data for trim ID: ${id}`);
        continue;
      }

      const vehicleDesc = `${year} ${make} ${model} ${trim_name || 'base'}`;
      const prompt = `What is the manufacturer's suggested retail price (MSRP) in USD for a ${vehicleDesc} in the United States? Please provide the starting MSRP price.`;

      try {
        console.log(`🔍 Searching MSRP for: ${vehicleDesc}`);

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an automotive pricing expert. Your job is to provide accurate MSRP (Manufacturer's Suggested Retail Price) information for vehicles in the United States. 
              
              Please search current automotive sources and provide the starting MSRP price. Include the dollar amount clearly in your response.
              
              If you cannot find the exact trim, provide the base model MSRP for that year and make/model combination.`,
            },
            { 
              role: 'user', 
              content: prompt 
            },
          ],
          temperature: 0.1, // Low temperature for more consistent results
        });

        const reply = response.choices?.[0]?.message?.content || '';
        console.log(`💬 OpenAI response for ${vehicleDesc}: ${reply.substring(0, 200)}...`);

        const price = extractPrice(reply);

        if (price && price >= 15000 && price <= 200000) {
          console.log(`✅ Found MSRP for ${vehicleDesc}: $${price.toLocaleString()}`);
          
          const { error: updateError } = await supabase
            .from('model_trims')
            .update({ msrp: price })
            .eq('id', id);

          if (updateError) {
            console.error(`❌ Failed to update MSRP for ${vehicleDesc}:`, updateError);
            failCount++;
          } else {
            successCount++;
          }
        } else {
          console.warn(`⚠️ Could not extract valid MSRP from response for ${vehicleDesc}`);
          failCount++;
        }
      } catch (error) {
        console.error(`❌ OpenAI API failed for ${vehicleDesc}:`, error);
        failCount++;
      }

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log('🎉 MSRP population complete!');
    console.log(`✅ Successfully updated: ${successCount} trims`);
    console.log(`❌ Failed to update: ${failCount} trims`);

  } catch (error) {
    console.error('❌ Script failed with error:', error);
  }
}

// Run the script if called directly
if (import.meta.main) {
  populateMsrpsFromWebSearch();
}
