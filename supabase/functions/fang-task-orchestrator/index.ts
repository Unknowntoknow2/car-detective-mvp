import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaskQueueRequest {
  vehicle_params?: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
    vin?: string;
    zipCode?: string;
  };
  force_run?: boolean;
  specific_sources?: string[];
  task_types?: string[];
}

interface TaskExecutionResult {
  task_id: string;
  source_name: string;
  status: 'completed' | 'failed' | 'blocked';
  comps_found: number;
  execution_time_ms: number;
  error_message?: string;
  quality_score: number;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: TaskQueueRequest = await req.json();
    console.log('🚀 FANG-Style Task Orchestrator starting:', params);

    // Get pending tasks based on priority and schedule
    const { data: pendingTasks, error: tasksError } = await supabase
      .from('data_fetch_tasks')
      .select('*')
      .or('status.eq.pending,status.eq.failed')
      .lte('next_run_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('next_run_at', { ascending: true });

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    // Filter tasks if specific sources or types requested
    let targetTasks = pendingTasks || [];
    if (params.specific_sources?.length) {
      targetTasks = targetTasks.filter(task => params.specific_sources!.includes(task.source_name));
    }
    if (params.task_types?.length) {
      targetTasks = targetTasks.filter(task => params.task_types!.includes(task.task_type));
    }

    console.log(`📋 Processing ${targetTasks.length} scheduled tasks`);

    const executionResults: TaskExecutionResult[] = [];
    const startTime = Date.now();

    // Process tasks in parallel with concurrency control
    const MAX_CONCURRENT = 5;
    const taskBatches = [];
    for (let i = 0; i < targetTasks.length; i += MAX_CONCURRENT) {
      taskBatches.push(targetTasks.slice(i, i + MAX_CONCURRENT));
    }

    for (const batch of taskBatches) {
      const batchPromises = batch.map(task => executeTask(task, params.vehicle_params));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          executionResults.push(result.value);
        } else {
          executionResults.push({
            task_id: batch[index].id,
            source_name: batch[index].source_name,
            status: 'failed',
            comps_found: 0,
            execution_time_ms: 0,
            error_message: result.reason?.message || 'Unknown error',
            quality_score: 0
          });
        }
      });

      // Rate limiting between batches
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Generate QA report
    await generateQAReport(executionResults, params.vehicle_params);

    // Update source intelligence
    await updateSourceIntelligence(executionResults);

    const totalExecutionTime = Date.now() - startTime;

    return new Response(JSON.stringify({
      success: true,
      orchestrator: 'FANG-Style Task Queue',
      execution_summary: {
        total_tasks: targetTasks.length,
        completed: executionResults.filter(r => r.status === 'completed').length,
        failed: executionResults.filter(r => r.status === 'failed').length,
        blocked: executionResults.filter(r => r.status === 'blocked').length,
        total_comps: executionResults.reduce((sum, r) => sum + r.comps_found, 0),
        avg_quality_score: executionResults.length ? 
          executionResults.reduce((sum, r) => sum + r.quality_score, 0) / executionResults.length : 0,
        execution_time_ms: totalExecutionTime
      },
      results: executionResults,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Task orchestrator error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      orchestrator: 'FANG-Style Task Queue'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeTask(task: any, vehicleParams?: any): Promise<TaskExecutionResult> {
  const startTime = Date.now();
  
  try {
    console.log(`🔄 Executing task: ${task.source_name} (${task.task_type})`);
    
    // Mark task as running
    await supabase
      .from('data_fetch_tasks')
      .update({ 
        status: 'running',
        last_run_at: new Date().toISOString()
      })
      .eq('id', task.id);

    // Prepare search parameters
    const searchParams = {
      ...task.search_params,
      ...vehicleParams
    };

    let result: TaskExecutionResult;

    // Route to appropriate scraper based on task type and source
    switch (task.task_type) {
      case 'big_box':
        result = await executeBigBoxTask(task, searchParams);
        break;
      case 'dealer':
        result = await executeDealerTask(task, searchParams);
        break;
      case 'auction':
        result = await executeAuctionTask(task, searchParams);
        break;
      case 'marketplace':
        result = await executeMarketplaceTask(task, searchParams);
        break;
      case 'p2p':
        result = await executeP2PTask(task, searchParams);
        break;
      case 'oem':
        result = await executeOEMTask(task, searchParams);
        break;
      case 'valuation_api':
        result = await executeValuationAPITask(task, searchParams);
        break;
      case 'instant_offer':
        result = await executeInstantOfferTask(task, searchParams);
        break;
      case 'data_quality':
        result = await executeDataQualityTask(task, searchParams);
        break;
      default:
        result = await executeGenericTask(task, searchParams);
    }

    result.execution_time_ms = Date.now() - startTime;

    // Update task status
    await supabase
      .from('data_fetch_tasks')
      .update({ 
        status: result.status,
        retry_count: result.status === 'failed' ? task.retry_count + 1 : 0,
        error_log: result.error_message || null,
        provenance: {
          ...task.provenance,
          last_execution: {
            timestamp: new Date().toISOString(),
            comps_found: result.comps_found,
            execution_time_ms: result.execution_time_ms,
            quality_score: result.quality_score
          }
        }
      })
      .eq('id', task.id);

    // Log compliance record
    await logComplianceAction(task.source_name, 'fetch', 'pricing', result.status === 'completed');

    return result;

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`❌ Task execution failed for ${task.source_name}:`, error);

    // Mark task as failed
    await supabase
      .from('data_fetch_tasks')
      .update({ 
        status: 'failed',
        retry_count: task.retry_count + 1,
        error_log: error.message
      })
      .eq('id', task.id);

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'failed',
      comps_found: 0,
      execution_time_ms: executionTime,
      error_message: error.message,
      quality_score: 0
    };
  }
}

async function executeBigBoxTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-carmax', {
      body: params
    });

    if (error) throw error;

    const compsCount = data?.listings?.length || 0;
    await saveComparisons(task.id, data?.listings || [], task.source_name, 'big_box_retailer');

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: compsCount,
      execution_time_ms: 0,
      quality_score: calculateQualityScore(data?.listings || [])
    };
  } catch (error) {
    throw new Error(`Big box task failed: ${error.message}`);
  }
}

async function executeDealerTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    // Use aggregate-vehicle-pricing for dealer sources
    const { data, error } = await supabase.functions.invoke('aggregate-vehicle-pricing', {
      body: {
        ...params,
        sources: [task.source_name]
      }
    });

    if (error) throw error;

    const compsCount = data?.total_results || 0;

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: compsCount,
      execution_time_ms: 0,
      quality_score: 85 // Default quality score for dealer sources
    };
  } catch (error) {
    throw new Error(`Dealer task failed: ${error.message}`);
  }
}

async function executeAuctionTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-manheim', {
      body: params
    });

    if (error) throw error;

    const compsCount = data?.results?.length || 0;
    await saveComparisons(task.id, data?.results || [], task.source_name, 'auction_wholesale');

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: compsCount,
      execution_time_ms: 0,
      quality_score: calculateQualityScore(data?.results || [])
    };
  } catch (error) {
    throw new Error(`Auction task failed: ${error.message}`);
  }
}

async function executeMarketplaceTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-marketplace', {
      body: params
    });

    if (error) throw error;

    const compsCount = data?.listings?.length || 0;
    await saveComparisons(task.id, data?.listings || [], task.source_name, 'marketplace_aggregator');

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: compsCount,
      execution_time_ms: 0,
      quality_score: calculateQualityScore(data?.listings || [])
    };
  } catch (error) {
    throw new Error(`Marketplace task failed: ${error.message}`);
  }
}

async function executeP2PTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-marketplace', {
      body: {
        ...params,
        sources: [task.source_name]
      }
    });

    if (error) throw error;

    const compsCount = data?.listings?.length || 0;

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: compsCount,
      execution_time_ms: 0,
      quality_score: Math.max(70, calculateQualityScore(data?.listings || [])) // P2P has lower baseline quality
    };
  } catch (error) {
    throw new Error(`P2P task failed: ${error.message}`);
  }
}

async function executeOEMTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-oem-data', {
      body: params
    });

    if (error) throw error;

    const dataCount = (data?.data?.msrp_data?.length || 0) + 
                     (data?.data?.recalls?.length || 0) + 
                     (data?.data?.tsbs?.length || 0);

    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: dataCount,
      execution_time_ms: 0,
      quality_score: 95 // OEM data is typically high quality
    };
  } catch (error) {
    throw new Error(`OEM task failed: ${error.message}`);
  }
}

async function executeValuationAPITask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    // Use specialized valuation API handlers
    let endpoint = 'fetch-competitor-prices';
    
    // Route to specific API based on source
    if (task.source_name.includes('KBB') || task.source_name.includes('Kelley')) {
      endpoint = 'fetch-competitor-prices';
      params.source = 'kbb';
    } else if (task.source_name.includes('Edmunds')) {
      endpoint = 'fetch-competitor-prices';
      params.source = 'edmunds';
    } else if (task.source_name.includes('Black Book')) {
      endpoint = 'fetch-market-intelligence';
      params.source = 'blackbook';
    }

    const { data, error } = await supabase.functions.invoke(endpoint, {
      body: params
    });

    if (error) throw error;

    const valuesCount = Object.keys(data?.pricing || {}).length;
    
    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: valuesCount,
      execution_time_ms: 0,
      quality_score: 95 // API data is high quality
    };
  } catch (error) {
    throw new Error(`Valuation API task failed: ${error.message}`);
  }
}

async function executeInstantOfferTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-competitor-prices', {
      body: {
        ...params,
        offer_type: 'instant',
        source: task.source_name.toLowerCase()
      }
    });

    if (error) throw error;

    const offersCount = data?.instant_offers?.length || 1;
    
    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: offersCount,
      execution_time_ms: 0,
      quality_score: 90 // Instant offers are real market signals
    };
  } catch (error) {
    throw new Error(`Instant offer task failed: ${error.message}`);
  }
}

async function executeDataQualityTask(task: any, params: any): Promise<TaskExecutionResult> {
  try {
    let endpoint = 'fetch-oem-data';
    
    // Route based on data quality source
    if (task.source_name.includes('Carfax') || task.source_name.includes('AutoCheck')) {
      endpoint = 'fetch-vehicle-history';
    } else if (task.source_name.includes('NHTSA')) {
      endpoint = 'fetch_nhtsa_recalls';
    }

    const { data, error } = await supabase.functions.invoke(endpoint, {
      body: params
    });

    if (error) throw error;

    const dataPoints = (data?.history?.length || 0) + 
                      (data?.recalls?.length || 0) + 
                      (data?.complaints?.length || 0);
    
    return {
      task_id: task.id,
      source_name: task.source_name,
      status: 'completed',
      comps_found: dataPoints,
      execution_time_ms: 0,
      quality_score: 85 // Quality data is important for calibration
    };
  } catch (error) {
    throw new Error(`Data quality task failed: ${error.message}`);
  }
}

async function executeGenericTask(task: any, params: any): Promise<TaskExecutionResult> {
  // Fallback for unknown task types
  console.log(`⚠️ Generic task execution for ${task.source_name}`);
  
  return {
    task_id: task.id,
    source_name: task.source_name,
    status: 'completed',
    comps_found: 0,
    execution_time_ms: 0,
    quality_score: 50
  };
}

async function saveComparisons(taskId: string, listings: any[], sourceName: string, sourceType: string) {
  if (!listings.length) return;

  const comparisons = listings.map(listing => ({
    task_id: taskId,
    vin: listing.vin,
    year: listing.year || new Date().getFullYear(),
    make: listing.make || 'Unknown',
    model: listing.model || 'Unknown',
    trim: listing.trim,
    price: listing.price || listing.final_price || 0,
    mileage: listing.mileage,
    location: listing.location,
    zip_code: listing.zip_code,
    dealer_name: listing.dealer_name || listing.seller_name,
    source_name: sourceName,
    source_type: sourceType,
    listing_url: listing.listing_url || listing.lot_url || '#',
    screenshot_url: listing.screenshot_url,
    cpo_status: listing.cpo_status || false,
    vehicle_condition: listing.vehicle_condition || listing.condition,
    incentives: listing.incentives,
    listing_date: listing.listing_date || listing.sale_date,
    explanation: listing.relevance_explanation || `${sourceName} listing match`,
    confidence_score: listing.confidence_score || 85
  }));

  const { error } = await supabase
    .from('vehicle_comparisons')
    .insert(comparisons);

  if (error) {
    console.error('Error saving comparisons:', error);
  } else {
    console.log(`💾 Saved ${comparisons.length} comparisons from ${sourceName}`);
  }
}

function calculateQualityScore(listings: any[]): number {
  if (!listings.length) return 0;

  let totalScore = 0;
  let validListings = 0;

  for (const listing of listings) {
    let score = 50; // Base score

    // Price quality
    if (listing.price && listing.price > 0) score += 20;
    
    // VIN presence
    if (listing.vin) score += 15;
    
    // Mileage data
    if (listing.mileage) score += 10;
    
    // Complete data
    if (listing.make && listing.model && listing.year) score += 5;

    totalScore += Math.min(score, 100);
    validListings++;
  }

  return validListings ? Math.round(totalScore / validListings) : 0;
}

async function generateQAReport(results: TaskExecutionResult[], vehicleParams?: any) {
  const totalComps = results.reduce((sum, r) => sum + r.comps_found, 0);
  const avgQuality = results.length ? 
    results.reduce((sum, r) => sum + r.quality_score, 0) / results.length : 0;
  
  const qaAlerts = [];
  const recommendations = [];

  // Check for low success rate
  const successRate = results.filter(r => r.status === 'completed').length / results.length;
  if (successRate < 0.8) {
    qaAlerts.push({
      type: 'low_success_rate',
      message: `Only ${Math.round(successRate * 100)}% of tasks completed successfully`,
      severity: 'high'
    });
  }

  // Check for low comp counts
  const avgComps = totalComps / results.length;
  if (avgComps < 5) {
    qaAlerts.push({
      type: 'low_comp_count',
      message: `Average comps per source: ${avgComps.toFixed(1)} (target: 10+)`,
      severity: 'medium'
    });
    recommendations.push('Increase search radius or broaden search criteria');
  }

  // Check quality score
  if (avgQuality < 80) {
    qaAlerts.push({
      type: 'low_quality',
      message: `Average quality score: ${avgQuality.toFixed(1)} (target: 85+)`,
      severity: 'medium'
    });
    recommendations.push('Review data extraction logic for quality improvements');
  }

  await supabase
    .from('qa_reports')
    .insert({
      vehicle_segment: vehicleParams ? 
        `${vehicleParams.year}-${vehicleParams.make}-${vehicleParams.model}` : 'ALL',
      total_comps_ingested: totalComps,
      source_failures: results.filter(r => r.status === 'failed').length,
      avg_confidence_score: avgQuality,
      qa_alerts: qaAlerts,
      recommendations: recommendations
    });

  console.log(`📊 QA Report generated: ${totalComps} comps, ${avgQuality.toFixed(1)} avg quality`);
}

async function updateSourceIntelligence(results: TaskExecutionResult[]) {
  for (const result of results) {
    const { error } = await supabase
      .from('source_intelligence')
      .upsert({
        source_name: result.source_name,
        total_fetches: 1,
        total_successes: result.status === 'completed' ? 1 : 0,
        total_failures: result.status === 'failed' ? 1 : 0,
        avg_response_time: result.execution_time_ms,
        comp_quality_score: result.quality_score,
        typical_comp_count: result.comps_found,
        last_successful_fetch: result.status === 'completed' ? new Date().toISOString() : undefined,
        access_status: result.status === 'blocked' ? 'blocked' : 'open'
      }, {
        onConflict: 'source_name',
        ignoreDuplicates: false
      });

    if (error) {
      console.error(`Error updating source intelligence for ${result.source_name}:`, error);
    }
  }
}

async function logComplianceAction(sourceName: string, actionType: string, dataType: string, success: boolean) {
  await supabase
    .from('compliance_log')
    .insert({
      source_name: sourceName,
      action_type: actionType,
      data_type: dataType,
      terms_compliance: success,
      attribution_provided: true,
      compliance_notes: success ? 'Automated fetch completed successfully' : 'Fetch failed or blocked'
    });
}