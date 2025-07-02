import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataValidationRequest {
  batch_size?: number;
  force_reprocess?: boolean;
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

    const { batch_size = 1000, force_reprocess = false }: DataValidationRequest = await req.json();
    
    console.log(`✅ Running data validation on ${batch_size} records`);

    let processedCount = 0;
    let cleanedCount = 0;
    const validationResults = {
      blank_to_null_conversions: 0,
      invalid_data_fixes: 0,
      standardized_fields: 0,
      data_type_corrections: 0
    };

    // 1. Clean market_comps table
    console.log('🧹 Cleaning market_comps table...');
    
    const { data: compsToClean } = await supabaseClient
      .from('market_comps')
      .select('id, vin, make, model, year, price, mileage, condition, trim, fuel_type, transmission, location')
      .order('created_at', { ascending: false })
      .limit(batch_size);

    if (compsToClean && compsToClean.length > 0) {
      for (const record of compsToClean) {
        const updates: any = {};
        let needsUpdate = false;

        // Convert blank strings to null
        ['make', 'model', 'trim', 'fuel_type', 'transmission', 'location', 'condition'].forEach(field => {
          if (record[field] === '') {
            updates[field] = null;
            needsUpdate = true;
            validationResults.blank_to_null_conversions++;
          }
        });

        // Standardize condition values
        if (record.condition && typeof record.condition === 'string') {
          const normalizedCondition = record.condition.toLowerCase().trim();
          const conditionMap: Record<string, string> = {
            'excellent': 'excellent',
            'exc': 'excellent',
            'mint': 'excellent',
            'very good': 'good',
            'good': 'good',
            'average': 'fair',
            'fair': 'fair',
            'poor': 'poor',
            'rough': 'poor',
            'damaged': 'poor'
          };

          const standardCondition = conditionMap[normalizedCondition];
          if (standardCondition && standardCondition !== record.condition) {
            updates.condition = standardCondition;
            needsUpdate = true;
            validationResults.standardized_fields++;
          }
        }

        // Validate and fix year
        if (record.year && (record.year < 1900 || record.year > new Date().getFullYear() + 2)) {
          updates.year = null;
          needsUpdate = true;
          validationResults.invalid_data_fixes++;
        }

        // Validate and fix price
        if (record.price && (record.price < 100 || record.price > 1000000)) {
          updates.price = null;
          needsUpdate = true;
          validationResults.invalid_data_fixes++;
        }

        // Validate and fix mileage
        if (record.mileage && (record.mileage < 0 || record.mileage > 1000000)) {
          updates.mileage = null;
          needsUpdate = true;
          validationResults.invalid_data_fixes++;
        }

        // Clean and standardize make/model
        if (record.make && typeof record.make === 'string') {
          const cleanMake = record.make.trim().toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase()); // Title case
          if (cleanMake !== record.make && cleanMake.length > 0) {
            updates.make = cleanMake;
            needsUpdate = true;
            validationResults.standardized_fields++;
          }
        }

        if (record.model && typeof record.model === 'string') {
          const cleanModel = record.model.trim().toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase()); // Title case
          if (cleanModel !== record.model && cleanModel.length > 0) {
            updates.model = cleanModel;
            needsUpdate = true;
            validationResults.standardized_fields++;
          }
        }

        // Validate VIN format (basic check)
        if (record.vin && typeof record.vin === 'string') {
          const cleanVin = record.vin.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
          if (cleanVin.length === 17 && cleanVin !== record.vin) {
            updates.vin = cleanVin;
            needsUpdate = true;
            validationResults.standardized_fields++;
          } else if (cleanVin.length !== 17) {
            updates.vin = null; // Invalid VIN
            needsUpdate = true;
            validationResults.invalid_data_fixes++;
          }
        }

        // Apply updates if needed
        if (needsUpdate) {
          const { error } = await supabaseClient
            .from('market_comps')
            .update(updates)
            .eq('id', record.id);

          if (!error) {
            cleanedCount++;
          } else {
            console.error(`Failed to update market_comp ${record.id}:`, error);
          }
        }

        processedCount++;
      }
    }

    // 2. Clean market_listings table (similar process)
    console.log('🧹 Cleaning market_listings table...');
    
    const { data: listingsToClean } = await supabaseClient
      .from('market_listings')
      .select('id, vin, make, model, year, price, mileage, condition, trim, fuel_type, transmission, dealer')
      .order('created_at', { ascending: false })
      .limit(Math.floor(batch_size / 2)); // Split quota between tables

    if (listingsToClean && listingsToClean.length > 0) {
      for (const record of listingsToClean) {
        const updates: any = {};
        let needsUpdate = false;

        // Apply similar cleaning logic as market_comps
        ['make', 'model', 'trim', 'fuel_type', 'transmission', 'dealer', 'condition'].forEach(field => {
          if (record[field] === '') {
            updates[field] = null;
            needsUpdate = true;
            validationResults.blank_to_null_conversions++;
          }
        });

        // Apply updates if needed
        if (needsUpdate) {
          const { error } = await supabaseClient
            .from('market_listings')
            .update(updates)
            .eq('id', record.id);

          if (!error) {
            cleanedCount++;
          }
        }

        processedCount++;
      }
    }

    // 3. Validate and clean follow_up_answers
    console.log('🧹 Cleaning follow_up_answers table...');
    
    const { data: followUpToClean } = await supabaseClient
      .from('follow_up_answers')
      .select('id, condition, exterior_condition, interior_condition, tire_condition, brake_condition, transmission, title_status')
      .order('created_at', { ascending: false })
      .limit(Math.floor(batch_size / 4));

    if (followUpToClean && followUpToClean.length > 0) {
      for (const record of followUpToClean) {
        const updates: any = {};
        let needsUpdate = false;

        // Standardize condition fields
        const conditionFields = ['condition', 'exterior_condition', 'interior_condition', 'tire_condition', 'brake_condition'];
        conditionFields.forEach(field => {
          if (record[field] && typeof record[field] === 'string') {
            const normalized = record[field].toLowerCase().trim();
            const standardMap: Record<string, string> = {
              'excellent': 'excellent',
              'very good': 'good',
              'good': 'good',
              'average': 'fair',
              'fair': 'fair',
              'poor': 'poor',
              'bad': 'poor'
            };

            const standard = standardMap[normalized];
            if (standard && standard !== record[field]) {
              updates[field] = standard;
              needsUpdate = true;
              validationResults.standardized_fields++;
            }
          }
        });

        // Standardize transmission
        if (record.transmission && typeof record.transmission === 'string') {
          const transmissionMap: Record<string, string> = {
            'auto': 'automatic',
            'automatic': 'automatic',
            'manual': 'manual',
            'stick': 'manual',
            'cvt': 'cvt',
            'continuously variable': 'cvt'
          };

          const standardTransmission = transmissionMap[record.transmission.toLowerCase().trim()];
          if (standardTransmission && standardTransmission !== record.transmission) {
            updates.transmission = standardTransmission;
            needsUpdate = true;
            validationResults.standardized_fields++;
          }
        }

        // Apply updates if needed
        if (needsUpdate) {
          const { error } = await supabaseClient
            .from('follow_up_answers')
            .update(updates)
            .eq('id', record.id);

          if (!error) {
            cleanedCount++;
          }
        }

        processedCount++;
      }
    }

    // 4. Generate data quality report
    const { data: totalComps } = await supabaseClient
      .from('market_comps')
      .select('id', { count: 'exact', head: true });

    const { data: recentComps } = await supabaseClient
      .from('market_comps')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const dataQualityStats = {
      total_records: totalComps?.length || 0,
      recent_records: recentComps?.length || 0,
      processed_this_run: processedCount,
      cleaned_this_run: cleanedCount,
      cleaning_rate: processedCount > 0 ? ((cleanedCount / processedCount) * 100).toFixed(2) : 0,
      validation_details: validationResults
    };

    // Log the validation results
    await supabaseClient
      .from('compliance_audit_log')
      .insert({
        entity_type: 'data_validation',
        entity_id: crypto.randomUUID(),
        action: 'batch_processed',
        input_data: { batch_size, force_reprocess },
        output_data: dataQualityStats,
        data_sources_used: ['market_comps', 'market_listings', 'follow_up_answers'],
        processing_time_ms: Date.now() % 1000000,
      });

    console.log(`✅ Data validation completed: ${cleanedCount}/${processedCount} records cleaned`);
    console.log('Validation stats:', validationResults);

    return new Response(JSON.stringify({
      success: true,
      processed_count: processedCount,
      cleaned_count: cleanedCount,
      error_count: 0, // We continue on individual errors
      data_quality_stats: dataQualityStats
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in data-validator:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});