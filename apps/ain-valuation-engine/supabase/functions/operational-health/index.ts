// @ts-ignore - Deno remote imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface HealthCheckRequest {
  check_type?: 'quick' | 'comprehensive' | 'specific';
  checks?: string[];
  include_metrics?: boolean;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  checks: HealthCheck[];
  overall_score: number;
  response_time_ms: number;
  timestamp: string;
  metrics?: OperationalMetric[];
}

interface HealthCheck {
  name: string;
  type: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  response_time_ms: number;
  details: any;
  error_message?: string;
  last_healthy_at?: string;
  consecutive_failures: number;
}

interface OperationalMetric {
  name: string;
  value: number;
  unit: string;
  category: string;
  component: string;
  threshold_status: 'normal' | 'warning' | 'critical';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const startTime = Date.now()

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let request: HealthCheckRequest = {}
    if (req.method === 'POST') {
      request = await req.json()
    } else {
      // Parse query parameters for GET requests
      const url = new URL(req.url)
      request = {
        check_type: url.searchParams.get('check_type') as any || 'quick',
        include_metrics: url.searchParams.get('include_metrics') === 'true'
      }
    }

    const { check_type = 'quick', checks, include_metrics = false } = request

    console.log(`Running health check - Type: ${check_type}`)

    const healthChecks: HealthCheck[] = []
    
    // Define which checks to run based on type
    let checksToRun: string[] = []
    
    if (checks && checks.length > 0) {
      checksToRun = checks
    } else {
      switch (check_type) {
        case 'quick':
          checksToRun = ['database_connection', 'basic_query']
          break
        case 'comprehensive':
          checksToRun = [
            'database_connection',
            'basic_query',
            'edge_functions',
            'external_apis',
            'data_freshness',
            'performance_metrics',
            'error_rates'
          ]
          break
        case 'specific':
          checksToRun = checks || ['database_connection']
          break
      }
    }

    // Execute health checks
    for (const checkName of checksToRun) {
      try {
        const checkResult = await executeHealthCheck(supabaseClient, checkName)
        healthChecks.push(checkResult)
        
        // Log health check result to database
        await supabaseClient.rpc('run_health_check', {
          p_check_name: checkResult.name,
          p_check_type: checkResult.type,
          p_status: checkResult.status,
          p_response_time_ms: checkResult.response_time_ms,
          p_details: checkResult.details
        })
      } catch (error) {
        console.error(`Health check failed for ${checkName}:`, error)
        healthChecks.push({
          name: checkName,
          type: 'unknown',
          status: 'unhealthy',
          response_time_ms: 0,
          details: { error: error.message },
          error_message: error.message,
          consecutive_failures: 1
        })
      }
    }

    // Calculate overall health score
    const healthyChecks = healthChecks.filter(check => check.status === 'healthy').length
    const totalChecks = healthChecks.length
    const overallScore = totalChecks > 0 ? Math.round((healthyChecks / totalChecks) * 100) : 0

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' | 'unknown' = 'healthy'
    if (overallScore < 50) {
      overallStatus = 'unhealthy'
    } else if (overallScore < 80) {
      overallStatus = 'degraded'
    }

    const responseTime = Date.now() - startTime

    // Get operational metrics if requested
    let metrics: OperationalMetric[] = []
    if (include_metrics) {
      metrics = await getRecentOperationalMetrics(supabaseClient)
    }

    // Log overall health metric
    await supabaseClient.rpc('add_operational_metric', {
      p_metric_name: 'system_health_score',
      p_metric_value: overallScore,
      p_metric_unit: 'percentage',
      p_category: 'performance',
      p_source_component: 'operational_health'
    })

    const healthStatus: HealthStatus = {
      status: overallStatus,
      checks: healthChecks,
      overall_score: overallScore,
      response_time_ms: responseTime,
      timestamp: new Date().toISOString(),
      metrics: include_metrics ? metrics : undefined
    }

    console.log(`Health check completed - Status: ${overallStatus}, Score: ${overallScore}%`)

    return new Response(
      JSON.stringify(healthStatus),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: overallStatus === 'unhealthy' ? 503 : 200,
      },
    )
  } catch (error) {
    console.error('Operational health check error:', error)
    
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        error: error.message,
        response_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503,
      },
    )
  }
})

// Individual health check implementations
async function executeHealthCheck(supabaseClient: any, checkName: string): Promise<HealthCheck> {
  const checkStart = Date.now()

  switch (checkName) {
    case 'database_connection':
      return await checkDatabaseConnection(supabaseClient, checkStart)
    
    case 'basic_query':
      return await checkBasicQuery(supabaseClient, checkStart)
    
    case 'edge_functions':
      return await checkEdgeFunctions(supabaseClient, checkStart)
    
    case 'external_apis':
      return await checkExternalAPIs(supabaseClient, checkStart)
    
    case 'data_freshness':
      return await checkDataFreshness(supabaseClient, checkStart)
    
    case 'performance_metrics':
      return await checkPerformanceMetrics(supabaseClient, checkStart)
    
    case 'error_rates':
      return await checkErrorRates(supabaseClient, checkStart)
    
    default:
      throw new Error(`Unknown health check: ${checkName}`)
  }
}

async function checkDatabaseConnection(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select('count')
      .limit(1)

    const responseTime = Date.now() - startTime

    if (error) {
      return {
        name: 'Database Connection',
        type: 'database',
        status: 'unhealthy',
        response_time_ms: responseTime,
        details: { error: error.message },
        error_message: error.message,
        consecutive_failures: 1
      }
    }

    return {
      name: 'Database Connection',
      type: 'database',
      status: 'healthy',
      response_time_ms: responseTime,
      details: { connection_status: 'active' },
      consecutive_failures: 0
    }
  } catch (error) {
    return {
      name: 'Database Connection',
      type: 'database',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function checkBasicQuery(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    const { data, error } = await supabaseClient
      .from('golden_vins')
      .select('id, vin')
      .limit(5)

    const responseTime = Date.now() - startTime

    if (error) {
      return {
        name: 'Basic Query',
        type: 'database',
        status: 'unhealthy',
        response_time_ms: responseTime,
        details: { error: error.message },
        error_message: error.message,
        consecutive_failures: 1
      }
    }

    const status = responseTime < 1000 ? 'healthy' : (responseTime < 3000 ? 'degraded' : 'unhealthy')

    return {
      name: 'Basic Query',
      type: 'database',
      status,
      response_time_ms: responseTime,
      details: { 
        records_returned: data?.length || 0,
        query_performance: responseTime < 1000 ? 'excellent' : responseTime < 3000 ? 'acceptable' : 'poor'
      },
      consecutive_failures: status === 'healthy' ? 0 : 1
    }
  } catch (error) {
    return {
      name: 'Basic Query',
      type: 'database',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function checkEdgeFunctions(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    // Test the decode-vin edge function with a sample VIN
    const testVin = '1HGCM82633A004352' // Sample Honda VIN
    
    const { data, error } = await supabaseClient.functions.invoke('decode-vin', {
      body: { vin: testVin }
    })

    const responseTime = Date.now() - startTime

    if (error) {
      return {
        name: 'Edge Functions',
        type: 'api',
        status: 'unhealthy',
        response_time_ms: responseTime,
        details: { error: error.message, function_tested: 'decode-vin' },
        error_message: error.message,
        consecutive_failures: 1
      }
    }

    const status = responseTime < 2000 ? 'healthy' : (responseTime < 5000 ? 'degraded' : 'unhealthy')

    return {
      name: 'Edge Functions',
      type: 'api',
      status,
      response_time_ms: responseTime,
      details: { 
        function_tested: 'decode-vin',
        test_vin: testVin,
        response_data_size: JSON.stringify(data).length,
        performance: responseTime < 2000 ? 'excellent' : responseTime < 5000 ? 'acceptable' : 'poor'
      },
      consecutive_failures: status === 'healthy' ? 0 : 1
    }
  } catch (error) {
    return {
      name: 'Edge Functions',
      type: 'api',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message, function_tested: 'decode-vin' },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function checkExternalAPIs(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    // Test NHTSA API connectivity
    const nhtsaResponse = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
    
    if (!nhtsaResponse.ok) {
      throw new Error(`NHTSA API returned ${nhtsaResponse.status}`)
    }

    const responseTime = Date.now() - startTime
    const status = responseTime < 3000 ? 'healthy' : (responseTime < 10000 ? 'degraded' : 'unhealthy')

    return {
      name: 'External APIs',
      type: 'external_service',
      status,
      response_time_ms: responseTime,
      details: { 
        nhtsa_api_status: 'responding',
        response_status: nhtsaResponse.status,
        performance: responseTime < 3000 ? 'excellent' : responseTime < 10000 ? 'acceptable' : 'poor'
      },
      consecutive_failures: status === 'healthy' ? 0 : 1
    }
  } catch (error) {
    return {
      name: 'External APIs',
      type: 'external_service',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message, api_tested: 'NHTSA VPIC' },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function checkDataFreshness(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    // Check when the most recent data was added to key tables
    const checks = await Promise.all([
      supabaseClient.from('operational_metrics').select('recorded_at').order('recorded_at', { ascending: false }).limit(1),
      supabaseClient.from('iihs_ratings_enhanced').select('created_at').order('created_at', { ascending: false }).limit(1),
      supabaseClient.from('market_signals').select('created_at').order('created_at', { ascending: false }).limit(1)
    ])

    const responseTime = Date.now() - startTime
    const now = new Date()
    const details: any = {}
    let oldestData = 0

    // Check operational metrics (should be recent)
    if (checks[0].data && checks[0].data.length > 0) {
      const lastMetric = new Date(checks[0].data[0].recorded_at)
      const ageHours = (now.getTime() - lastMetric.getTime()) / (1000 * 60 * 60)
      details.last_operational_metric_hours_ago = Math.round(ageHours * 10) / 10
      oldestData = Math.max(oldestData, ageHours)
    }

    // Check IIHS data (can be older)
    if (checks[1].data && checks[1].data.length > 0) {
      const lastIIHS = new Date(checks[1].data[0].created_at)
      const ageDays = (now.getTime() - lastIIHS.getTime()) / (1000 * 60 * 60 * 24)
      details.last_iihs_data_days_ago = Math.round(ageDays * 10) / 10
    }

    // Check market signals (should be relatively recent)
    if (checks[2].data && checks[2].data.length > 0) {
      const lastMarket = new Date(checks[2].data[0].created_at)
      const ageHours = (now.getTime() - lastMarket.getTime()) / (1000 * 60 * 60)
      details.last_market_signal_hours_ago = Math.round(ageHours * 10) / 10
      oldestData = Math.max(oldestData, ageHours)
    }

    // Determine status based on data freshness
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (oldestData > 48) { // 48 hours
      status = 'unhealthy'
    } else if (oldestData > 12) { // 12 hours
      status = 'degraded'
    }

    return {
      name: 'Data Freshness',
      type: 'database',
      status,
      response_time_ms: responseTime,
      details,
      consecutive_failures: status === 'healthy' ? 0 : 1
    }
  } catch (error) {
    return {
      name: 'Data Freshness',
      type: 'database',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function checkPerformanceMetrics(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    // Get recent performance metrics
    const { data, error } = await supabaseClient
      .from('operational_metrics')
      .select('metric_name, metric_value, metric_unit')
      .eq('category', 'performance')
      .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('recorded_at', { ascending: false })

    const responseTime = Date.now() - startTime

    if (error) {
      throw new Error(error.message)
    }

    // Analyze performance metrics
    const avgResponseTimes = data.filter(m => m.metric_name.includes('response_time'))
    const errorRates = data.filter(m => m.metric_name.includes('error_rate'))
    
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    const details: any = {
      metrics_analyzed: data.length,
      avg_response_times_count: avgResponseTimes.length,
      error_rates_count: errorRates.length
    }

    // Check average response times
    if (avgResponseTimes.length > 0) {
      const avgResponseTime = avgResponseTimes.reduce((sum, m) => sum + m.metric_value, 0) / avgResponseTimes.length
      details.avg_response_time_ms = Math.round(avgResponseTime)
      
      if (avgResponseTime > 5000) {
        status = 'unhealthy'
      } else if (avgResponseTime > 2000) {
        status = 'degraded'
      }
    }

    return {
      name: 'Performance Metrics',
      type: 'performance',
      status,
      response_time_ms: responseTime,
      details,
      consecutive_failures: status === 'healthy' ? 0 : 1
    }
  } catch (error) {
    return {
      name: 'Performance Metrics',
      type: 'performance',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function checkErrorRates(supabaseClient: any, startTime: number): Promise<HealthCheck> {
  try {
    // Get recent errors from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data, error } = await supabaseClient
      .from('error_tracking')
      .select('error_type, severity, frequency_count, resolution_status')
      .gte('last_occurred_at', oneHourAgo)

    const responseTime = Date.now() - startTime

    if (error) {
      throw new Error(error.message)
    }

    const totalErrors = data.reduce((sum, err) => sum + err.frequency_count, 0)
    const criticalErrors = data.filter(err => err.severity === 'critical')
    const unresolvedErrors = data.filter(err => err.resolution_status === 'open')

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    
    if (criticalErrors.length > 0) {
      status = 'unhealthy'
    } else if (totalErrors > 100 || unresolvedErrors.length > 10) {
      status = 'degraded'
    }

    return {
      name: 'Error Rates',
      type: 'performance',
      status,
      response_time_ms: responseTime,
      details: {
        total_errors_last_hour: totalErrors,
        critical_errors: criticalErrors.length,
        unresolved_errors: unresolvedErrors.length,
        error_categories: [...new Set(data.map(err => err.error_type))].length
      },
      consecutive_failures: status === 'healthy' ? 0 : 1
    }
  } catch (error) {
    return {
      name: 'Error Rates',
      type: 'performance',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error.message },
      error_message: error.message,
      consecutive_failures: 1
    }
  }
}

async function getRecentOperationalMetrics(supabaseClient: any): Promise<OperationalMetric[]> {
  try {
    const { data, error } = await supabaseClient
      .from('operational_metrics')
      .select('metric_name, metric_value, metric_unit, category, source_component, is_within_threshold')
      .gte('recorded_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
      .order('recorded_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Failed to fetch operational metrics:', error)
      return []
    }

    return data.map(metric => ({
      name: metric.metric_name,
      value: metric.metric_value,
      unit: metric.metric_unit,
      category: metric.category,
      component: metric.source_component,
      threshold_status: metric.is_within_threshold ? 'normal' : 'warning'
    }))
  } catch (error) {
    console.error('Error fetching operational metrics:', error)
    return []
  }
}
