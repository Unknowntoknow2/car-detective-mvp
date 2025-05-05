import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { predictValuation, ValuationFeatures } from "../lib/inferenceModel.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { valuationId } = await req.json();
    
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "valuationId required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the valuation data
    const { data: val, error: valErr } = await supabase
      .from("valuations")
      .select(`
        base_price,
        condition_score,
        mileage,
        accident_count,
        zip_demand_factor,
        dealer_avg_price,
        auction_avg_price,
        feature_value_total,
        zip_code: state,
        exterior_color,
        color_multiplier,
        fuel_type,
        transmission_type,
        has_open_recall,
        warranty_status,
        sale_date,
        body_style,
        driving_profile,
        driving_profile_multiplier
      `)
      .eq("id", valuationId)
      .single();

    if (valErr || !val) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }), 
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get most recent photo score for this valuation
    const { data: photoScoreData, error: photoScoreErr } = await supabase
      .from("photo_scores")
      .select("score")
      .eq("valuation_id", valuationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const photoScore = photoScoreData?.score ?? 0.5; // Default to 0.5 if no photo score
    
    // Determine condition level based on condition_score
    let condition = "good";
    if (val.condition_score >= 85) condition = "excellent";
    else if (val.condition_score >= 65) condition = "good";
    else if (val.condition_score >= 40) condition = "fair";
    else condition = "poor";

    // Get pricing curve multiplier if we have a zip code
    let multiplier = 1.0;
    if (val.zip_code) {
      try {
        // First, try to get market-based multiplier from market_adjustments table
        const { data: marketAdjData, error: marketAdjError } = await supabase
          .from('market_adjustments')
          .select('market_multiplier')
          .eq('zip_code', val.zip_code)
          .maybeSingle();
          
        if (!marketAdjError && marketAdjData && marketAdjData.market_multiplier !== null) {
          multiplier = 1 + (marketAdjData.market_multiplier / 100);
          console.log(`Using market adjustment factor: ${multiplier} from market_adjustments table for zip: ${val.zip_code}`);
        } else {
          // Fall back to previous methods if not found in market_adjustments
          // First, try to get market-based multiplier
          const { data: marketData, error: marketErr } = await supabase.functions.invoke("fetch-market-listings", {
            body: { 
              zipCode: val.zip_code,
              make: val.make,
              model: val.model,
              year: val.year
            }
          });
          
          if (!marketErr && marketData && marketData.marketFactor) {
            multiplier = marketData.marketFactor;
            console.log(`Using market factor: ${multiplier} from listings API for zip: ${val.zip_code}`);
          } else {
            // Fall back to pricing curve if market data isn't available
            const { data: pricingData, error: pricingErr } = await supabase.functions.invoke("get-pricing-curve", {
              body: { 
                zip_code: val.zip_code,
                condition: condition
              }
            });
            
            if (!pricingErr && pricingData && pricingData.multiplier) {
              multiplier = pricingData.multiplier;
              console.log(`Using pricing multiplier: ${multiplier} for zip: ${val.zip_code}, condition: ${condition}`);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to get market data:", err);
        // Continue with default multiplier
      }
    }

    // Get color multiplier if present
    let colorMultiplier = 1.0;
    if (val.exterior_color) {
      try {
        // Use the existing color_multiplier from the valuation if it exists
        if (val.color_multiplier) {
          colorMultiplier = val.color_multiplier;
          console.log(`Using stored color multiplier: ${colorMultiplier} for color: ${val.exterior_color}`);
        } else {
          // Otherwise fetch from the color_adjustment table
          const { data: colorData, error: colorErr } = await supabase
            .from("color_adjustment")
            .select("multiplier")
            .eq("color", val.exterior_color)
            .single();
            
          if (!colorErr && colorData) {
            colorMultiplier = colorData.multiplier;
            console.log(`Fetched color multiplier: ${colorMultiplier} for color: ${val.exterior_color}`);
          }
        }
      } catch (err) {
        console.warn("Failed to get color multiplier:", err);
        // Continue with default multiplier
      }
    }
    
    // Get fuel type multiplier if present
    let fuelTypeMultiplier = 1.0;
    if (val.fuel_type) {
      try {
        const { data: fuelTypeData, error: fuelTypeErr } = await supabase
          .from("fuel_type_adjustment")
          .select("multiplier")
          .eq("type", val.fuel_type)
          .single();
          
        if (!fuelTypeErr && fuelTypeData) {
          fuelTypeMultiplier = fuelTypeData.multiplier;
          console.log(`Fetched fuel type multiplier: ${fuelTypeMultiplier} for fuel type: ${val.fuel_type}`);
        }
      } catch (err) {
        console.warn("Failed to get fuel type multiplier:", err);
        // Continue with default multiplier
      }
    }
    
    // Get transmission multiplier if present
    let transmissionMultiplier = 1.0;
    if (val.transmission_type) {
      try {
        const { data: transmissionData, error: transmissionErr } = await supabase
          .from("transmission_adjustment")
          .select("multiplier")
          .eq("type", val.transmission_type)
          .single();
          
        if (!transmissionErr && transmissionData) {
          transmissionMultiplier = transmissionData.multiplier;
          console.log(`Fetched transmission multiplier: ${transmissionMultiplier} for transmission type: ${val.transmission_type}`);
        }
      } catch (err) {
        console.warn("Failed to get transmission multiplier:", err);
        // Continue with default multiplier
      }
    }
    
    // Get recall multiplier if vehicle has open recall
    let recallMultiplier = 1.0;
    if (val.has_open_recall) {
      try {
        const { data: recallData, error: recallErr } = await supabase
          .from("recall_factor")
          .select("multiplier")
          .eq("has_open_recall", true)
          .single();
          
        if (!recallErr && recallData) {
          recallMultiplier = recallData.multiplier;
          console.log(`Fetched recall multiplier: ${recallMultiplier} for vehicle with open recall`);
        } else {
          // Default to 10% reduction if not found in the database
          recallMultiplier = 0.9;
          console.log(`Using default recall multiplier: ${recallMultiplier}`);
        }
      } catch (err) {
        console.warn("Failed to get recall multiplier:", err);
        // Continue with default multiplier
        recallMultiplier = 0.9;
      }
    }
    
    // Get warranty multiplier if warranty status is present
    let warrantyMultiplier = 1.0;
    if (val.warranty_status && val.warranty_status !== 'None') {
      try {
        const { data: warrantyData, error: warrantyErr } = await supabase
          .from("warranty_options")
          .select("multiplier")
          .eq("status", val.warranty_status)
          .single();
          
        if (!warrantyErr && warrantyData) {
          warrantyMultiplier = warrantyData.multiplier;
          console.log(`Fetched warranty multiplier: ${warrantyMultiplier} for warranty status: ${val.warranty_status}`);
        } else {
          // Default based on warranty type
          warrantyMultiplier = val.warranty_status === 'Factory' ? 1.02 : 1.04;
          console.log(`Using default warranty multiplier: ${warrantyMultiplier} for type: ${val.warranty_status}`);
        }
      } catch (err) {
        console.warn("Failed to get warranty multiplier:", err);
        // Continue with default multiplier based on type
        warrantyMultiplier = val.warranty_status === 'Factory' ? 1.02 : 1.04;
      }
    }

    // Get driving profile multiplier if present
    let drivingProfileMultiplier = 1.0;
    if (val.driving_profile) {
      try {
        // Use the existing driving_profile_multiplier from the valuation if it exists
        if (val.driving_profile_multiplier) {
          drivingProfileMultiplier = val.driving_profile_multiplier;
          console.log(`Using stored driving profile multiplier: ${drivingProfileMultiplier} for profile: ${val.driving_profile}`);
        } else {
          // Otherwise fetch from the driving_profile table
          const { data: drivingProfileData, error: drivingProfileErr } = await supabase
            .from("driving_profile")
            .select("multiplier")
            .eq("profile", val.driving_profile)
            .single();
            
          if (!drivingProfileErr && drivingProfileData) {
            drivingProfileMultiplier = drivingProfileData.multiplier;
            console.log(`Fetched driving profile multiplier: ${drivingProfileMultiplier} for profile: ${val.driving_profile}`);
          }
        }
      } catch (err) {
        console.warn("Failed to get driving profile multiplier:", err);
        // Continue with default multiplier
      }
    }

    // Apply base prediction model
    const features: ValuationFeatures = {
      basePrice: val.base_price,
      conditionScore: val.condition_score,
      mileage: val.mileage,
      accidentCount: val.accident_count,
      zipDemandFactor: val.zip_demand_factor,
      dealerAvgPrice: val.dealer_avg_price,
      auctionAvgPrice: val.auction_avg_price,
      featureValueTotal: val.feature_value_total,
    };

    const basePredictedPrice = predictValuation(features);
    
    // Apply photo score and multiplier adjustments
    // Formula: intermediateValue = basePrice * multiplier * (1 + (photoScore - 0.5) * 0.2)
    const photoAdjustment = (photoScore - 0.5) * 0.2;
    let intermediatePrice = basePredictedPrice * multiplier * (1 + photoAdjustment);
    
    // Apply color multiplier
    intermediatePrice = intermediatePrice * colorMultiplier;
    
    // Apply fuel type multiplier
    intermediatePrice = intermediatePrice * fuelTypeMultiplier;
    
    // Apply transmission multiplier
    intermediatePrice = intermediatePrice * transmissionMultiplier;
    
    // Apply recall multiplier
    intermediatePrice = intermediatePrice * recallMultiplier;
    
    // Apply driving profile multiplier
    intermediatePrice = intermediatePrice * drivingProfileMultiplier;
    
    // Apply warranty multiplier as the final adjustment
    const finalPrice = Math.round(intermediatePrice * warrantyMultiplier);

    // Apply seasonal multiplier if sale date and body style are provided
    let seasonalMultiplier = 1.0;
    if (val.sale_date && val.body_style) {
      try {
        const saleDate = new Date(val.sale_date);
        const month = saleDate.getMonth() + 1; // 1-12
        
        // Determine vehicle type based on body style
        let vehicleType = 'generic';
        const bodyStyle = val.body_style.toLowerCase();
        
        if (bodyStyle.includes('suv') || bodyStyle.includes('crossover')) {
          vehicleType = 'suv';
        } else if (bodyStyle.includes('convertible') || bodyStyle.includes('cabriolet')) {
          vehicleType = 'convertible';
        } else if (bodyStyle.includes('sport') || bodyStyle.includes('coupe')) {
          vehicleType = 'sport';
        } else if (bodyStyle.includes('truck') || bodyStyle.includes('pickup')) {
          vehicleType = 'truck';
        }
        
        // Fetch seasonal multiplier from database
        const { data: seasonalData, error: seasonalErr } = await supabase
          .from('seasonal_index')
          .select(vehicleType)
          .eq('month', month)
          .single();
          
        if (!seasonalErr && seasonalData) {
          seasonalMultiplier = seasonalData[vehicleType];
          console.log(`Fetched seasonal multiplier: ${seasonalMultiplier} for month: ${month}, vehicle type: ${vehicleType}`);
          intermediatePrice = intermediatePrice * seasonalMultiplier;
        }
      } catch (err) {
        console.warn("Failed to get seasonal multiplier:", err);
        // Continue with default multiplier
      }
    }

    // Return the final valuation with a breakdown
    return new Response(
      JSON.stringify({
        predictedPrice: finalPrice,
        breakdown: {
          basePrice: basePredictedPrice,
          zipMultiplier: multiplier,
          photoScore: photoScore,
          photoAdjustment: `${(photoAdjustment * 100).toFixed(1)}%`,
          colorMultiplier: colorMultiplier,
          colorAdjustment: `${((colorMultiplier - 1) * 100).toFixed(1)}%`,
          fuelTypeMultiplier: fuelTypeMultiplier,
          fuelTypeAdjustment: `${((fuelTypeMultiplier - 1) * 100).toFixed(1)}%`,
          transmissionMultiplier: transmissionMultiplier,
          transmissionAdjustment: `${((transmissionMultiplier - 1) * 100).toFixed(1)}%`,
          recallMultiplier: recallMultiplier,
          recallAdjustment: `${((recallMultiplier - 1) * 100).toFixed(1)}%`,
          warrantyMultiplier: warrantyMultiplier,
          warrantyAdjustment: `${((warrantyMultiplier - 1) * 100).toFixed(1)}%`,
          marketMultiplier: multiplier,
          marketAdjustment: `${((multiplier - 1) * 100).toFixed(1)}%`,
          seasonalMultiplier: seasonalMultiplier,
          seasonalAdjustment: `${((seasonalMultiplier - 1) * 100).toFixed(1)}%`,
          drivingProfileMultiplier: drivingProfileMultiplier,
          drivingProfileAdjustment: `${((drivingProfileMultiplier - 1) * 100).toFixed(1)}%`,
          finalPrice: finalPrice
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
