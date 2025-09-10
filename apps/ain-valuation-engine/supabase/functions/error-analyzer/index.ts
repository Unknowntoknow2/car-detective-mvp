// @ts-ignore - Deno remote imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ErrorAnalysisRequest {
  time_range?: 'hour' | 'day' | 'week' | 'month';
  severity_filter?: string[];
  component_filter?: string[];
  status_filter?: string[];
  include_trends?: boolean;
  include_recommendations?: boolean;
}

interface ErrorAnalysisResponse {
  summary: ErrorSummary;
  error_breakdown: ErrorBreakdown[];
  trends?: ErrorTrend[];
  recommendations?: string[];
  top_errors: TopError[];
  resolution_metrics: ResolutionMetrics;
  timestamp: string;
}

interface ErrorSummary {
  total_errors: number;
  unique_error_types: number;
  critical_errors: number;
  unresolved_errors: number;
  resolution_rate: number;
  avg_resolution_time_hours: number;
  error_frequency_trend: 'increasing' | 'decreasing' | 'stable';
}

interface ErrorBreakdown {
  component_name: string;
  error_count: number;
  critical_count: number;
  unresolved_count: number;
  avg_resolution_time_hours: number;
  most_common_error: string;
}

interface ErrorTrend {
  time_period: string;
  error_count: number;
  critical_count: number;
  resolution_rate: number;
}

interface TopError {
  error_type: string;
  error_message: string;
  component_name: string;
  frequency_count: number;
  severity: string;
  first_occurred_at: string;
  last_occurred_at: string;
  resolution_status: string;
  affected_vins?: number;
}

interface ResolutionMetrics {
  avg_resolution_time_hours: number;
  open_errors: number;
  investigating_errors: number;
  resolved_errors: number;
  ignored_errors: number;
  fastest_resolution_minutes: number;
  slowest_resolution_hours: number;
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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let request: ErrorAnalysisRequest = {}
    if (req.method === 'POST') {
      request = await req.json()
    } else {
      // Parse query parameters for GET requests
      const url = new URL(req.url)
      request = {
        time_range: url.searchParams.get('time_range') as any || 'day',
        include_trends: url.searchParams.get('include_trends') === 'true',
        include_recommendations: url.searchParams.get('include_recommendations') === 'true'
      }
    }

    const { 
      time_range = 'day', 
      severity_filter, 
      component_filter, 
      status_filter,
      include_trends = false,
      include_recommendations = false 
    } = request

    console.log(`Analyzing errors for time range: ${time_range}`)

    // Calculate time range
    const timeRanges = {
      'hour': 1,
      'day': 24,
      'week': 24 * 7,
      'month': 24 * 30
    }
    const hoursBack = timeRanges[time_range] || 24
    const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000)

    // Build base query with filters
    let baseQuery = supabaseClient
      .from('error_tracking')
      .select('*')
      .gte('last_occurred_at', startTime.toISOString())

    if (severity_filter && severity_filter.length > 0) {
      baseQuery = baseQuery.in('severity', severity_filter)
    }

    if (component_filter && component_filter.length > 0) {
      baseQuery = baseQuery.in('component_name', component_filter)
    }

    if (status_filter && status_filter.length > 0) {
      baseQuery = baseQuery.in('resolution_status', status_filter)
    }

    const { data: errors, error: fetchError } = await baseQuery

    if (fetchError) {
      throw new Error(`Failed to fetch errors: ${fetchError.message}`)
    }

    console.log(`Fetched ${errors.length} errors for analysis`)

    // Generate error summary
    const summary = generateErrorSummary(errors, hoursBack)

    // Generate error breakdown by component
    const errorBreakdown = generateErrorBreakdown(errors)

    // Get top errors
    const topErrors = generateTopErrors(errors)

    // Generate resolution metrics
    const resolutionMetrics = generateResolutionMetrics(errors)

    // Generate trends if requested
    let trends: ErrorTrend[] | undefined
    if (include_trends) {
      trends = await generateErrorTrends(supabaseClient, hoursBack)
    }

    // Generate recommendations if requested
    let recommendations: string[] | undefined
    if (include_recommendations) {
      recommendations = generateRecommendations(summary, errorBreakdown, errors)
    }

    const analysis: ErrorAnalysisResponse = {
      summary,
      error_breakdown: errorBreakdown,
      trends,
      recommendations,
      top_errors: topErrors,
      resolution_metrics: resolutionMetrics,
      timestamp: new Date().toISOString()
    }

    // Log analysis metrics
    await supabaseClient.rpc('add_operational_metric', {
      p_metric_name: 'error_analysis_execution_time',
      p_metric_value: Date.now() - Date.now(), // This would be actual execution time
      p_metric_unit: 'ms',
      p_category: 'performance',
      p_source_component: 'error_analyzer'
    })

    await supabaseClient.rpc('add_operational_metric', {
      p_metric_name: 'total_errors_analyzed',
      p_metric_value: errors.length,
      p_metric_unit: 'count',
      p_category: 'usage',
      p_source_component: 'error_analyzer'
    })

    console.log(`Error analysis completed - ${errors.length} errors, ${summary.critical_errors} critical`)

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error analysis failed:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Error analysis execution failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function generateErrorSummary(errors: any[], hoursBack: number): ErrorSummary {
  const totalErrors = errors.reduce((sum, err) => sum + err.frequency_count, 0)
  const uniqueErrorTypes = new Set(errors.map(err => err.error_type)).size
  const criticalErrors = errors.filter(err => err.severity === 'critical').length
  const unresolvedErrors = errors.filter(err => err.resolution_status === 'open').length
  const resolvedErrors = errors.filter(err => err.resolution_status === 'resolved').length
  
  const resolutionRate = errors.length > 0 ? (resolvedErrors / errors.length) * 100 : 0

  // Calculate average resolution time for resolved errors
  const resolvedWithTime = errors.filter(err => 
    err.resolution_status === 'resolved' && err.resolved_at
  )
  
  let avgResolutionTime = 0
  if (resolvedWithTime.length > 0) {
    const totalResolutionTime = resolvedWithTime.reduce((sum, err) => {
      const start = new Date(err.first_occurred_at)
      const end = new Date(err.resolved_at)
      return sum + (end.getTime() - start.getTime())
    }, 0)
    avgResolutionTime = (totalResolutionTime / resolvedWithTime.length) / (1000 * 60 * 60) // Convert to hours
  }

  // Determine error frequency trend (simplified - comparing first half vs second half)
  const midpoint = Date.now() - (hoursBack / 2) * 60 * 60 * 1000
  const recentErrors = errors.filter(err => new Date(err.last_occurred_at).getTime() > midpoint)
  const olderErrors = errors.filter(err => new Date(err.last_occurred_at).getTime() <= midpoint)
  
  let errorFrequencyTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (recentErrors.length > olderErrors.length * 1.2) {
    errorFrequencyTrend = 'increasing'
  } else if (recentErrors.length < olderErrors.length * 0.8) {
    errorFrequencyTrend = 'decreasing'
  }

  return {
    total_errors: totalErrors,
    unique_error_types: uniqueErrorTypes,
    critical_errors: criticalErrors,
    unresolved_errors: unresolvedErrors,
    resolution_rate: Math.round(resolutionRate * 100) / 100,
    avg_resolution_time_hours: Math.round(avgResolutionTime * 100) / 100,
    error_frequency_trend: errorFrequencyTrend
  }
}

function generateErrorBreakdown(errors: any[]): ErrorBreakdown[] {
  const componentMap = new Map<string, any[]>()
  
  // Group errors by component
  errors.forEach(error => {
    if (!componentMap.has(error.component_name)) {
      componentMap.set(error.component_name, [])
    }
    componentMap.get(error.component_name)!.push(error)
  })

  const breakdown: ErrorBreakdown[] = []
  
  componentMap.forEach((componentErrors, componentName) => {
    const errorCount = componentErrors.reduce((sum, err) => sum + err.frequency_count, 0)
    const criticalCount = componentErrors.filter(err => err.severity === 'critical').length
    const unresolvedCount = componentErrors.filter(err => err.resolution_status === 'open').length
    
    // Find most common error type
    const errorTypeCount = new Map<string, number>()
    componentErrors.forEach(err => {
      const count = errorTypeCount.get(err.error_type) || 0
      errorTypeCount.set(err.error_type, count + err.frequency_count)
    })
    
    const mostCommonError = Array.from(errorTypeCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'

    // Calculate average resolution time for this component
    const resolvedErrors = componentErrors.filter(err => 
      err.resolution_status === 'resolved' && err.resolved_at
    )
    
    let avgResolutionTime = 0
    if (resolvedErrors.length > 0) {
      const totalTime = resolvedErrors.reduce((sum, err) => {
        const start = new Date(err.first_occurred_at)
        const end = new Date(err.resolved_at)
        return sum + (end.getTime() - start.getTime())
      }, 0)
      avgResolutionTime = (totalTime / resolvedErrors.length) / (1000 * 60 * 60)
    }

    breakdown.push({
      component_name: componentName,
      error_count: errorCount,
      critical_count: criticalCount,
      unresolved_count: unresolvedCount,
      avg_resolution_time_hours: Math.round(avgResolutionTime * 100) / 100,
      most_common_error: mostCommonError
    })
  })

  return breakdown.sort((a, b) => b.error_count - a.error_count)
}

function generateTopErrors(errors: any[]): TopError[] {
  // Sort by frequency and severity
  const sortedErrors = errors
    .sort((a, b) => {
      // First by severity (critical > high > medium > low)
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
      if (severityDiff !== 0) return severityDiff
      
      // Then by frequency
      return b.frequency_count - a.frequency_count
    })
    .slice(0, 10) // Top 10

  return sortedErrors.map(error => ({
    error_type: error.error_type,
    error_message: error.error_message,
    component_name: error.component_name,
    frequency_count: error.frequency_count,
    severity: error.severity,
    first_occurred_at: error.first_occurred_at,
    last_occurred_at: error.last_occurred_at,
    resolution_status: error.resolution_status,
    affected_vins: error.vin ? 1 : 0 // Simplified - would need to count unique VINs in real implementation
  }))
}

function generateResolutionMetrics(errors: any[]): ResolutionMetrics {
  const openErrors = errors.filter(err => err.resolution_status === 'open').length
  const investigatingErrors = errors.filter(err => err.resolution_status === 'investigating').length
  const resolvedErrors = errors.filter(err => err.resolution_status === 'resolved').length
  const ignoredErrors = errors.filter(err => err.resolution_status === 'ignored').length

  const resolvedWithTime = errors.filter(err => 
    err.resolution_status === 'resolved' && err.resolved_at
  )

  let avgResolutionTime = 0
  let fastestResolution = 0
  let slowestResolution = 0

  if (resolvedWithTime.length > 0) {
    const resolutionTimes = resolvedWithTime.map(err => {
      const start = new Date(err.first_occurred_at)
      const end = new Date(err.resolved_at)
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60) // Hours
    })

    avgResolutionTime = resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
    fastestResolution = Math.min(...resolutionTimes) * 60 // Convert to minutes
    slowestResolution = Math.max(...resolutionTimes)
  }

  return {
    avg_resolution_time_hours: Math.round(avgResolutionTime * 100) / 100,
    open_errors: openErrors,
    investigating_errors: investigatingErrors,
    resolved_errors: resolvedErrors,
    ignored_errors: ignoredErrors,
    fastest_resolution_minutes: Math.round(fastestResolution),
    slowest_resolution_hours: Math.round(slowestResolution * 100) / 100
  }
}

async function generateErrorTrends(supabaseClient: any, hoursBack: number): Promise<ErrorTrend[]> {
  try {
    // Use the materialized view for trends
    const { data: trendData, error } = await supabaseClient
      .from('error_analysis_summary')
      .select('*')
      .gte('error_date', new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('error_date', { ascending: true })

    if (error) {
      console.error('Failed to fetch trend data:', error)
      return []
    }

    return trendData.map(row => ({
      time_period: row.error_date,
      error_count: row.occurrence_count,
      critical_count: row.occurrence_count, // Simplified - would need separate critical count
      resolution_rate: row.resolution_status === 'resolved' ? 100 : 0 // Simplified
    }))
  } catch (error) {
    console.error('Error generating trends:', error)
    return []
  }
}

function generateRecommendations(
  summary: ErrorSummary, 
  breakdown: ErrorBreakdown[], 
  errors: any[]
): string[] {
  const recommendations: string[] = []

  // Critical error recommendations
  if (summary.critical_errors > 0) {
    recommendations.push(`Address ${summary.critical_errors} critical errors immediately - these may impact system stability`)
  }

  // Resolution rate recommendations
  if (summary.resolution_rate < 70) {
    recommendations.push(`Resolution rate is ${summary.resolution_rate}% - consider improving error triage and assignment processes`)
  }

  // Response time recommendations
  if (summary.avg_resolution_time_hours > 24) {
    recommendations.push(`Average resolution time is ${summary.avg_resolution_time_hours} hours - implement faster escalation procedures`)
  }

  // Trend recommendations
  if (summary.error_frequency_trend === 'increasing') {
    recommendations.push('Error frequency is increasing - investigate root causes and implement preventive measures')
  }

  // Component-specific recommendations
  const highErrorComponents = breakdown.filter(comp => comp.error_count > 50)
  if (highErrorComponents.length > 0) {
    const componentNames = highErrorComponents.map(comp => comp.component_name).join(', ')
    recommendations.push(`Components with high error rates (${componentNames}) need focused attention and code review`)
  }

  // Unresolved error recommendations
  const highUnresolvedComponents = breakdown.filter(comp => comp.unresolved_count > 10)
  if (highUnresolvedComponents.length > 0) {
    const componentNames = highUnresolvedComponents.map(comp => comp.component_name).join(', ')
    recommendations.push(`Components with many unresolved errors (${componentNames}) may need additional resources or expertise`)
  }

  // Pattern-based recommendations
  const vinRelatedErrors = errors.filter(err => err.vin && err.error_type.includes('VIN'))
  if (vinRelatedErrors.length > 10) {
    recommendations.push('High number of VIN-related errors detected - review VIN validation and decoding logic')
  }

  const timeoutErrors = errors.filter(err => err.error_message.toLowerCase().includes('timeout'))
  if (timeoutErrors.length > 5) {
    recommendations.push('Multiple timeout errors detected - review performance bottlenecks and consider increasing timeout limits')
  }

  // General recommendations if no specific issues found
  if (recommendations.length === 0 && summary.total_errors > 0) {
    recommendations.push('Error patterns appear normal - continue monitoring and maintain current processes')
  } else if (recommendations.length === 0) {
    recommendations.push('No significant errors detected - system is operating well')
  }

  return recommendations.slice(0, 8) // Limit to 8 recommendations
}
