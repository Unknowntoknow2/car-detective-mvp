import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VinRecord {
  id: string;
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  table_name: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const vinauditApiKey = Deno.env.get('VINAUDIT_API_KEY');
    
    const { records }: { records: VinRecord[] } = await req.json();
    
    console.log(`🔍 Processing VIN enrichment for ${records.length} records`);

    const results = [];

    for (const record of records) {
      try {
        let enrichedData: any = {};
        let enrichmentScore = 0;
        const sources = [];

        // 1. NHTSA VIN Decoder (free, comprehensive)
        try {
          const nhtsaResponse = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${record.vin}?format=json`
          );
          const nhtsaData = await nhtsaResponse.json();

          if (nhtsaData.Results && nhtsaData.Results.length > 0) {
            const validResults = nhtsaData.Results.filter((r: any) => r.Value && r.Value !== 'Not Applicable');
            
            if (validResults.length > 0) {
              enrichedData.nhtsa_decode = validResults.reduce((acc: any, result: any) => {
                const key = result.Variable.toLowerCase().replace(/\s+/g, '_');
                acc[key] = result.Value;
                return acc;
              }, {});

              // Extract key fields
              enrichedData.make = enrichedData.nhtsa_decode.make || record.make;
              enrichedData.model = enrichedData.nhtsa_decode.model || record.model;
              enrichedData.year = parseInt(enrichedData.nhtsa_decode.model_year) || record.year;
              enrichedData.trim = enrichedData.nhtsa_decode.trim || record.trim;
              enrichedData.body_class = enrichedData.nhtsa_decode.body_class;
              enrichedData.fuel_type = enrichedData.nhtsa_decode.fuel_type_primary;
              enrichedData.transmission = enrichedData.nhtsa_decode.transmission_style;
              enrichedData.drivetrain = enrichedData.nhtsa_decode.drive_type;
              enrichedData.engine_displacement = enrichedData.nhtsa_decode.displacement_l;
              enrichedData.engine_cylinders = enrichedData.nhtsa_decode.engine_number_of_cylinders;

              sources.push('nhtsa');
              enrichmentScore += 40;
            }
          }
        } catch (error) {
          console.error(`NHTSA decode failed for VIN ${record.vin}:`, error);
        }

        // 2. VinAudit API (premium features)
        if (vinauditApiKey) {
          try {
            const vinauditResponse = await fetch(
              `https://marketcheck-vin-audit.p.rapidapi.com/v1/vin/${record.vin}`,
              {
                headers: {
                  'X-RapidAPI-Key': vinauditApiKey,
                  'X-RapidAPI-Host': 'marketcheck-vin-audit.p.rapidapi.com'
                }
              }
            );

            if (vinauditResponse.ok) {
              const vinauditData = await vinauditResponse.json();
              
              if (vinauditData && !vinauditData.error) {
                enrichedData.vinaudit_data = vinauditData;
                
                // Extract valuable fields
                if (vinauditData.vehicle) {
                  enrichedData.engine_size = vinauditData.vehicle.engine?.displacement;
                  enrichedData.horsepower = vinauditData.vehicle.engine?.horsepower;
                  enrichedData.mpg_city = vinauditData.vehicle.mpg?.city;
                  enrichedData.mpg_highway = vinauditData.vehicle.mpg?.highway;
                  enrichedData.msrp = vinauditData.vehicle.msrp;
                }

                if (vinauditData.market_value) {
                  enrichedData.estimated_value_vinaudit = vinauditData.market_value.mean;
                  enrichedData.value_range_low = vinauditData.market_value.below;
                  enrichedData.value_range_high = vinauditData.market_value.above;
                }

                sources.push('vinaudit');
                enrichmentScore += 30;
              }
            }
          } catch (error) {
            console.error(`VinAudit decode failed for VIN ${record.vin}:`, error);
          }
        }

        // 3. Additional data validation and cleanup
        if (enrichedData.year && (enrichedData.year < 1900 || enrichedData.year > new Date().getFullYear() + 2)) {
          enrichedData.year = null; // Invalid year
        }

        if (enrichedData.mileage === '') {
          enrichedData.mileage = null; // Convert blank to null
        }

        // Calculate final enrichment score
        const hasBasicInfo = enrichedData.make && enrichedData.model && enrichedData.year;
        const hasDetailedInfo = enrichedData.trim || enrichedData.engine_displacement || enrichedData.fuel_type;
        const hasMarketData = enrichedData.estimated_value_vinaudit || enrichedData.msrp;

        if (hasBasicInfo) enrichmentScore += 20;
        if (hasDetailedInfo) enrichmentScore += 10;
        if (hasMarketData) enrichmentScore += 10;

        enrichmentScore = Math.min(enrichmentScore, 100);

        // Store enrichment data
        const { error: enrichmentError } = await supabaseClient
          .from('vin_enrichment_data')
          .upsert({
            vin: record.vin,
            source: sources.join(','),
            decoded_data: enrichedData,
            enrichment_score: enrichmentScore,
            last_enriched_at: new Date().toISOString(),
          }, {
            onConflict: 'vin,source'
          });

        if (enrichmentError) {
          console.error(`Failed to store enrichment for VIN ${record.vin}:`, enrichmentError);
        }

        // Update the original record if we have better data
        if (hasBasicInfo && record.table_name) {
          const updateFields: any = {};
          
          if (!record.make && enrichedData.make) updateFields.make = enrichedData.make;
          if (!record.model && enrichedData.model) updateFields.model = enrichedData.model;
          if (!record.year && enrichedData.year) updateFields.year = enrichedData.year;
          if (!record.trim && enrichedData.trim) updateFields.trim = enrichedData.trim;

          if (Object.keys(updateFields).length > 0) {
            const { error: updateError } = await supabaseClient
              .from(record.table_name)
              .update(updateFields)
              .eq('id', record.id);

            if (updateError) {
              console.error(`Failed to update record ${record.id}:`, updateError);
            }
          }
        }

        results.push({
          vin: record.vin,
          success: true,
          enrichment_score: enrichmentScore,
          sources: sources,
          fields_enriched: Object.keys(enrichedData).length
        });

        console.log(`✅ Enriched VIN ${record.vin}: score ${enrichmentScore}, sources: ${sources.join(',')}`);

      } catch (error) {
        console.error(`Failed to process VIN ${record.vin}:`, error);
        results.push({
          vin: record.vin,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const avgScore = results.filter(r => r.success).reduce((sum, r) => sum + (r.enrichment_score || 0), 0) / successCount || 0;

    console.log(`🎯 VIN enrichment completed: ${successCount}/${records.length} successful, avg score: ${avgScore.toFixed(1)}`);

    return new Response(JSON.stringify({
      success: true,
      processed: records.length,
      successful: successCount,
      failed: records.length - successCount,
      average_enrichment_score: avgScore.toFixed(1),
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vin-enrichment-processor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});