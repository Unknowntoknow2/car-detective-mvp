import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VehicleParams {
  year: number;
  make: string;
  model: string;
  trim?: string;
  zip: string;
  mileage: number;
  vin: string;
}

interface OrchestrationResult {
  protocol: string;
  success: boolean;
  comps_found: number;
  execution_time_ms: number;
  price_summary?: any;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: VehicleParams = await req.json();
    console.log('🚀 AIN Full Market Orchestrator starting for:', params);

    const startTime = Date.now();
    const orchestrationResults: OrchestrationResult[] = [];

    // Define all AIN protocols to execute in parallel
    const ainProtocols = [
      {
        name: 'Wholesale & Auction Data',
        function: 'ain-wholesale-auction-search',
        priority: 1
      },
      {
        name: 'Major Franchise Dealers',
        function: 'ain-franchise-dealer-search',
        priority: 2
      },
      {
        name: 'Online Retailers & Big Box',
        function: 'scrape-carmax', // Use existing function
        priority: 3
      },
      {
        name: 'Marketplaces & Classifieds',
        function: 'ain-marketplace-classifieds-search',
        priority: 4
      },
      {
        name: 'Book/Guide/API Valuations',
        function: 'fetch-competitor-prices', // Use existing function
        priority: 5
      },
      {
        name: 'CPO & OEM Data',
        function: 'fetch-oem-data', // Use existing function
        priority: 6
      },
      {
        name: 'Title/History/Recalls',
        function: 'fetch-vehicle-history', // Use existing function
        priority: 7
      }
    ];

    console.log(`📋 Executing ${ainProtocols.length} AIN protocols in parallel...`);

    // Execute all protocols in parallel with timeout handling
    const protocolPromises = ainProtocols.map(async (protocol) => {
      const protocolStartTime = Date.now();
      
      try {
        console.log(`🔄 Starting protocol: ${protocol.name}`);
        
        const { data, error } = await supabase.functions.invoke(protocol.function, {
          body: params
        });

        const executionTime = Date.now() - protocolStartTime;

        if (error) {
          throw new Error(`${protocol.function} error: ${error.message}`);
        }

        return {
          protocol: protocol.name,
          success: true,
          comps_found: data?.comps_found || data?.total_results || data?.listings?.length || 0,
          execution_time_ms: executionTime,
          price_summary: data?.price_summary || data?.summary,
          function_used: protocol.function,
          priority: protocol.priority,
          raw_data: data
        };

      } catch (error) {
        const executionTime = Date.now() - protocolStartTime;
        console.error(`❌ Protocol ${protocol.name} failed:`, error);
        
        return {
          protocol: protocol.name,
          success: false,
          comps_found: 0,
          execution_time_ms: executionTime,
          error: error.message,
          function_used: protocol.function,
          priority: protocol.priority
        };
      }
    });

    // Wait for all protocols to complete (with 60 second timeout)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Orchestration timeout')), 60000)
    );

    try {
      const results = await Promise.race([
        Promise.allSettled(protocolPromises),
        timeoutPromise
      ]) as PromiseSettledResult<OrchestrationResult>[];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          orchestrationResults.push(result.value);
        } else {
          orchestrationResults.push({
            protocol: ainProtocols[index].name,
            success: false,
            comps_found: 0,
            execution_time_ms: 0,
            error: result.reason?.message || 'Promise rejected'
          });
        }
      });

    } catch (timeoutError) {
      console.error('⏱️ Orchestration timed out');
      return new Response(JSON.stringify({
        success: false,
        error: 'Orchestration timeout - some protocols may still be running',
        partial_results: orchestrationResults
      }), {
        status: 408,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Aggregate results and generate comprehensive summary
    const totalExecutionTime = Date.now() - startTime;
    const successfulProtocols = orchestrationResults.filter(r => r.success);
    const failedProtocols = orchestrationResults.filter(r => !r.success);
    const totalComps = orchestrationResults.reduce((sum, r) => sum + r.comps_found, 0);

    // Get all price summaries for meta-analysis
    const priceSummaries = successfulProtocols
      .filter(r => r.price_summary)
      .map(r => ({
        protocol: r.protocol,
        summary: r.price_summary,
        comps: r.comps_found
      }));

    // Generate QA report
    await generateAINQAReport(params, orchestrationResults, totalComps);

    // Log comprehensive execution data
    await logOrchestrationExecution(params, orchestrationResults, totalExecutionTime);

    const response = {
      success: true,
      orchestrator: 'AIN Full Market Data Protocol',
      vehicle_params: params,
      execution_summary: {
        total_protocols: ainProtocols.length,
        successful_protocols: successfulProtocols.length,
        failed_protocols: failedProtocols.length,
        total_comps_collected: totalComps,
        total_execution_time_ms: totalExecutionTime,
        avg_protocol_time_ms: orchestrationResults.length > 0 ? 
          orchestrationResults.reduce((sum, r) => sum + r.execution_time_ms, 0) / orchestrationResults.length : 0
      },
      protocol_results: orchestrationResults.sort((a, b) => (a.priority || 999) - (b.priority || 999)),
      price_analysis: priceSummaries,
      market_coverage: {
        wholesale_auction: successfulProtocols.some(p => p.protocol.includes('Wholesale')),
        franchise_dealers: successfulProtocols.some(p => p.protocol.includes('Franchise')),
        big_box_retailers: successfulProtocols.some(p => p.protocol.includes('Big Box')),
        marketplaces: successfulProtocols.some(p => p.protocol.includes('Marketplace')),
        book_valuations: successfulProtocols.some(p => p.protocol.includes('Book')),
        oem_cpo: successfulProtocols.some(p => p.protocol.includes('CPO')),
        history_recalls: successfulProtocols.some(p => p.protocol.includes('History'))
      },
      quality_metrics: {
        coverage_score: (successfulProtocols.length / ainProtocols.length) * 100,
        comp_density: totalComps / ainProtocols.length,
        confidence_level: totalComps >= 20 ? 'High' : totalComps >= 10 ? 'Medium' : 'Low'
      },
      timestamp: new Date().toISOString()
    };

    console.log(`✅ AIN Orchestration completed: ${totalComps} comps from ${successfulProtocols.length}/${ainProtocols.length} protocols`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ AIN Full Market Orchestrator error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      orchestrator: 'AIN Full Market Data Protocol'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateAINQAReport(params: VehicleParams, results: OrchestrationResult[], totalComps: number) {
  try {
    const qaAlerts = [];
    const recommendations = [];

    // Check protocol coverage
    const successRate = results.filter(r => r.success).length / results.length;
    if (successRate < 0.7) {
      qaAlerts.push({
        type: 'low_protocol_success',
        message: `Only ${Math.round(successRate * 100)}% of AIN protocols completed successfully`,
        severity: 'high'
      });
    }

    // Check comp density
    if (totalComps < 15) {
      qaAlerts.push({
        type: 'low_comp_density',
        message: `Only ${totalComps} total comps collected (target: 20+)`,
        severity: 'medium'
      });
      recommendations.push('Expand search radius or relax trim/mileage criteria');
    }

    // Check for critical protocol failures
    const criticalProtocols = ['Wholesale & Auction Data', 'Major Franchise Dealers'];
    const failedCritical = results.filter(r => !r.success && criticalProtocols.includes(r.protocol));
    if (failedCritical.length > 0) {
      qaAlerts.push({
        type: 'critical_protocol_failure',
        message: `Critical protocols failed: ${failedCritical.map(p => p.protocol).join(', ')}`,
        severity: 'high'
      });
    }

    await supabase
      .from('qa_reports')
      .insert({
        vehicle_segment: `${params.year}-${params.make}-${params.model}`,
        total_comps_ingested: totalComps,
        source_failures: results.filter(r => !r.success).length,
        avg_confidence_score: totalComps > 0 ? 85 : 0, // Default confidence for AIN protocols
        qa_alerts: qaAlerts,
        recommendations: recommendations
      });

  } catch (error) {
    console.error('Error generating AIN QA report:', error);
  }
}

async function logOrchestrationExecution(params: VehicleParams, results: OrchestrationResult[], totalTime: number) {
  try {
    // Log to compliance table for audit trail
    await supabase
      .from('compliance_log')
      .insert({
        source_name: 'AIN Full Market Orchestrator',
        action_type: 'aggregate',
        data_type: 'market_pricing',
        terms_compliance: true,
        attribution_provided: true,
        compliance_notes: `Executed ${results.length} protocols for ${params.year} ${params.make} ${params.model}. Total execution time: ${totalTime}ms. Comps collected: ${results.reduce((sum, r) => sum + r.comps_found, 0)}`
      });

  } catch (error) {
    console.error('Error logging orchestration execution:', error);
  }
}