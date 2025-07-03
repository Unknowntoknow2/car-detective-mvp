import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnomalyDetectionRequest {
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

    const { batch_size = 500, force_reprocess = false }: AnomalyDetectionRequest = await req.json();
    
    console.log(`🚨 Running anomaly detection on ${batch_size} records`);

    let processedCount = 0;
    let flaggedCount = 0;
    const anomalies = [];

    // Get recent market comps and listings for analysis
    const { data: recentRecords } = await supabaseClient
      .from('market_comps')
      .select('id, vin, year, make, model, price, mileage, condition, location, source, created_at')
      .order('created_at', { ascending: false })
      .limit(batch_size);

    if (!recentRecords || recentRecords.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No records to analyze',
        processed_count: 0,
        flagged_count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Anomaly Detection Rules
    for (const record of recentRecords) {
      const flags = [];
      
      try {
        // 1. Zero-mile anomaly (cars with 0 miles that aren't brand new)
        if (record.mileage === 0 && record.year && record.year < new Date().getFullYear()) {
          flags.push({
            type: 'zero_mile_anomaly',
            reason: `${record.year} vehicle with 0 miles`,
            confidence: 90,
            severity: 'high'
          });
        }

        // 2. Age-inconsistent mileage (extremely low or high mileage for age)
        if (record.year && record.mileage && record.mileage > 0) {
          const vehicleAge = new Date().getFullYear() - record.year;
          const expectedMileage = vehicleAge * 12000; // Average 12k miles/year
          const mileageDeviation = Math.abs(record.mileage - expectedMileage) / expectedMileage;

          if (mileageDeviation > 0.8) { // 80% deviation
            const type = record.mileage < expectedMileage * 0.2 ? 'suspiciously_low_mileage' : 'extremely_high_mileage';
            flags.push({
              type: type,
              reason: `${record.mileage} miles on ${vehicleAge}-year-old vehicle (expected ~${expectedMileage})`,
              confidence: Math.min(95, 60 + (mileageDeviation * 50)),
              severity: mileageDeviation > 1.5 ? 'high' : 'medium'
            });
          }
        }

        // 3. Price anomalies (far below or above market)
        if (record.price && record.year && record.make && record.model) {
          // Get comparable vehicles for price comparison
          const { data: comparables } = await supabaseClient
            .from('market_comps')
            .select('price')
            .eq('make', record.make)
            .eq('model', record.model)
            .gte('year', record.year - 2)
            .lte('year', record.year + 2)
            .gte('price', 1000) // Exclude likely data errors
            .limit(50);

          if (comparables && comparables.length >= 5) {
            const prices = comparables.map(c => c.price).sort((a, b) => a - b);
            const median = prices[Math.floor(prices.length / 2)];
            const q1 = prices[Math.floor(prices.length * 0.25)];
            const q3 = prices[Math.floor(prices.length * 0.75)];
            const iqr = q3 - q1;

            // Extreme outliers (beyond 3x IQR)
            const lowerBound = q1 - (3 * iqr);
            const upperBound = q3 + (3 * iqr);

            if (record.price < lowerBound && record.price < median * 0.3) {
              flags.push({
                type: 'price_too_low',
                reason: `Price $${record.price} is ${((median - record.price) / median * 100).toFixed(1)}% below median $${median}`,
                confidence: 85,
                severity: 'high'
              });
            } else if (record.price > upperBound && record.price > median * 3) {
              flags.push({
                type: 'price_too_high',
                reason: `Price $${record.price} is ${((record.price - median) / median * 100).toFixed(1)}% above median $${median}`,
                confidence: 75,
                severity: 'medium'
              });
            }
          }
        }

        // 4. Impossible combinations
        if (record.year && record.year > new Date().getFullYear() + 1) {
          flags.push({
            type: 'future_year',
            reason: `Vehicle year ${record.year} is in the future`,
            confidence: 100,
            severity: 'high'
          });
        }

        if (record.year && record.year < 1900) {
          flags.push({
            type: 'invalid_year',
            reason: `Vehicle year ${record.year} is unrealistic`,
            confidence: 100,
            severity: 'high'
          });
        }

        // 5. Duplicate listing detection (same VIN, similar price/location)
        if (record.vin) {
          const { data: duplicates } = await supabaseClient
            .from('market_comps')
            .select('id, price, source, location')
            .eq('vin', record.vin)
            .neq('id', record.id)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

          if (duplicates && duplicates.length > 0) {
            const samePriceCount = duplicates.filter(d => 
              Math.abs(d.price - record.price) < record.price * 0.05 // Within 5%
            ).length;

            if (samePriceCount > 0) {
              flags.push({
                type: 'potential_duplicate',
                reason: `VIN appears ${duplicates.length + 1} times in last 30 days with similar pricing`,
                confidence: 70 + (samePriceCount * 10),
                severity: 'medium'
              });
            }
          }
        }

        // 6. Missing critical data
        const missingFields = [];
        if (!record.make) missingFields.push('make');
        if (!record.model) missingFields.push('model');
        if (!record.year) missingFields.push('year');
        if (!record.price || record.price <= 0) missingFields.push('price');

        if (missingFields.length > 0) {
          flags.push({
            type: 'incomplete_data',
            reason: `Missing critical fields: ${missingFields.join(', ')}`,
            confidence: 95,
            severity: 'medium'
          });
        }

        // Store any anomalies found
        for (const flag of flags) {
          const { error: flagError } = await supabaseClient
            .from('fraud_detection_flags')
            .insert({
              listing_id: record.id,
              vin: record.vin,
              flag_type: flag.type,
              flag_reason: flag.reason,
              confidence_score: flag.confidence,
              auto_flagged: true,
              human_reviewed: false,
            });

          if (!flagError) {
            anomalies.push({
              record_id: record.id,
              vin: record.vin,
              flag: flag
            });
            flaggedCount++;
          }
        }

        processedCount++;

      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error);
      }
    }

    // Generate summary statistics
    const flagTypeStats = anomalies.reduce((acc, anomaly) => {
      const type = anomaly.flag.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`🎯 Anomaly detection completed: ${flaggedCount} anomalies found in ${processedCount} records`);
    console.log('Flag types:', flagTypeStats);

    return new Response(JSON.stringify({
      success: true,
      processed_count: processedCount,
      flagged_count: flaggedCount,
      error_count: recentRecords.length - processedCount,
      anomaly_rate: ((flaggedCount / processedCount) * 100).toFixed(2),
      flag_type_breakdown: flagTypeStats,
      sample_anomalies: anomalies.slice(0, 10) // Return first 10 for review
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in anomaly-detector:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});