
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  error?: string;
  details?: any;
}

export async function runSystemHealthCheck(): Promise<SystemHealthCheck[]> {
  const results: SystemHealthCheck[] = [];
  
  // 1. Database connectivity
  const dbStart = performance.now();
  try {
    const { data, error } = await supabase
      .from('valuation_results')
      .select('count')
      .limit(1);
    
    const dbLatency = performance.now() - dbStart;
    
    if (error) {
      results.push({
        component: 'Database',
        status: 'down',
        error: error.message,
        latency: dbLatency
      });
    } else {
      results.push({
        component: 'Database',
        status: 'healthy',
        latency: dbLatency
      });
    }
  } catch (error) {
    results.push({
      component: 'Database',
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // 2. Check critical tables exist and have data
  const criticalTables = [
    'valuation_results',
    'decoded_vehicles',
    'auction_results_by_vin',
    'scraped_listings',
    'follow_up_answers'
  ];

  for (const table of criticalTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results.push({
          component: `Table: ${table}`,
          status: 'down',
          error: error.message
        });
      } else {
        results.push({
          component: `Table: ${table}`,
          status: count === 0 ? 'degraded' : 'healthy',
          details: { recordCount: count }
        });
      }
    } catch (error) {
      results.push({
        component: `Table: ${table}`,
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 3. Check recent valuations (last 24 hours)
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('valuation_results')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday);

    results.push({
      component: 'Recent Activity',
      status: (count || 0) > 0 ? 'healthy' : 'degraded',
      details: { valuationsLast24h: count }
    });
  } catch (error) {
    results.push({
      component: 'Recent Activity',
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return results;
}

export function printSystemHealth(checks: SystemHealthCheck[]): void {
  console.log('\n🏥 SYSTEM HEALTH CHECK REPORT');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  const healthy = checks.filter(c => c.status === 'healthy').length;
  const degraded = checks.filter(c => c.status === 'degraded').length;
  const down = checks.filter(c => c.status === 'down').length;
  
  console.log(`\n📊 OVERALL STATUS:`);
  console.log(`  ✅ Healthy: ${healthy}`);
  console.log(`  ⚠️  Degraded: ${degraded}`);
  console.log(`  ❌ Down: ${down}`);
  
  console.log(`\n🔍 COMPONENT DETAILS:`);
  checks.forEach(check => {
    const icon = check.status === 'healthy' ? '✅' : 
                 check.status === 'degraded' ? '⚠️' : '❌';
    
    let line = `  ${icon} ${check.component}: ${check.status.toUpperCase()}`;
    
    if (check.latency) {
      line += ` (${check.latency.toFixed(2)}ms)`;
    }
    
    if (check.error) {
      line += ` - Error: ${check.error}`;
    }
    
    if (check.details) {
      line += ` - ${JSON.stringify(check.details)}`;
    }
    
    console.log(line);
  });
  
  const overallStatus = down > 0 ? 'CRITICAL' : degraded > 0 ? 'DEGRADED' : 'HEALTHY';
  console.log(`\n🎯 OVERALL SYSTEM STATUS: ${overallStatus}`);
}
