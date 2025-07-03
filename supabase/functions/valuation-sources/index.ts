import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface MarketSource {
  id: string;
  name: string;
  url: string;
  type: string;
  searchPattern: string;
  status: 'active' | 'inactive' | 'rate_limited' | 'blocked';
  last_accessed?: string;
  success_rate?: number;
  avg_response_time_ms?: number;
  priority: number;
}

// Market sources configuration matching valuation-aggregate
const MARKET_SOURCES: MarketSource[] = [
  // Franchise Dealers (Priority 1)
  { 
    id: 'autonation', 
    name: 'AutoNation', 
    url: 'https://www.autonation.com/inventory', 
    type: 'franchise_dealer', 
    searchPattern: 'site:autonation.com',
    status: 'active',
    priority: 1
  },
  { 
    id: 'lithia', 
    name: 'Lithia Motors', 
    url: 'https://www.lithiamotors.com/', 
    type: 'franchise_dealer', 
    searchPattern: 'site:lithiamotors.com OR site:lithia.com',
    status: 'active',
    priority: 1
  },
  { 
    id: 'sonic', 
    name: 'Sonic Automotive', 
    url: 'https://www.sonicautomotive.com/', 
    type: 'franchise_dealer', 
    searchPattern: 'site:sonicautomotive.com',
    status: 'active',
    priority: 1
  },
  { 
    id: 'group1', 
    name: 'Group 1 Automotive', 
    url: 'https://www.group1auto.com/', 
    type: 'franchise_dealer', 
    searchPattern: 'site:group1auto.com',
    status: 'active',
    priority: 1
  },
  
  // Big Box Retailers (Priority 2)
  { 
    id: 'carmax', 
    name: 'CarMax', 
    url: 'https://www.carmax.com/cars', 
    type: 'big_box', 
    searchPattern: 'site:carmax.com',
    status: 'active',
    priority: 2
  },
  { 
    id: 'carvana', 
    name: 'Carvana', 
    url: 'https://www.carvana.com/cars', 
    type: 'big_box', 
    searchPattern: 'site:carvana.com',
    status: 'active',
    priority: 2
  },
  { 
    id: 'vroom', 
    name: 'Vroom', 
    url: 'https://www.vroom.com/', 
    type: 'big_box', 
    searchPattern: 'site:vroom.com',
    status: 'active',
    priority: 2
  },
  { 
    id: 'echopark', 
    name: 'EchoPark', 
    url: 'https://www.echopark.com/', 
    type: 'big_box', 
    searchPattern: 'site:echopark.com',
    status: 'active',
    priority: 2
  },
  
  // Marketplaces (Priority 3)
  { 
    id: 'cars_com', 
    name: 'Cars.com', 
    url: 'https://www.cars.com/', 
    type: 'marketplace', 
    searchPattern: 'site:cars.com',
    status: 'active',
    priority: 3
  },
  { 
    id: 'autotrader', 
    name: 'AutoTrader', 
    url: 'https://www.autotrader.com/', 
    type: 'marketplace', 
    searchPattern: 'site:autotrader.com',
    status: 'active',
    priority: 3
  },
  { 
    id: 'cargurus', 
    name: 'CarGurus', 
    url: 'https://www.cargurus.com/', 
    type: 'marketplace', 
    searchPattern: 'site:cargurus.com',
    status: 'active',
    priority: 3
  },
  
  // Auctions (Priority 4)
  { 
    id: 'manheim', 
    name: 'Manheim', 
    url: 'https://www.manheim.com/', 
    type: 'auction', 
    searchPattern: 'site:manheim.com',
    status: 'active',
    priority: 4
  },
  { 
    id: 'copart', 
    name: 'Copart', 
    url: 'https://www.copart.com/', 
    type: 'auction', 
    searchPattern: 'site:copart.com',
    status: 'active',
    priority: 4
  },
  
  // Book Values (Priority 5)
  { 
    id: 'kbb', 
    name: 'KBB', 
    url: 'https://www.kbb.com/', 
    type: 'book_value', 
    searchPattern: 'site:kbb.com',
    status: 'active',
    priority: 5
  },
  { 
    id: 'edmunds', 
    name: 'Edmunds', 
    url: 'https://www.edmunds.com/', 
    type: 'book_value', 
    searchPattern: 'site:edmunds.com',
    status: 'active',
    priority: 5
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📊 Sources API called');

    // Get authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        api: 'valuation-sources'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication',
        api: 'valuation-sources'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get recent source performance metrics from audit logs
    const { data: recentLogs } = await supabase
      .from('valuation_audit_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .eq('event', 'fetch_completed')
      .order('created_at', { ascending: false });

    // Calculate source metrics
    const sourceMetrics = MARKET_SOURCES.map(source => {
      const sourceId = source.id;
      
      // Find recent usage data for this source
      const sourceLogs = recentLogs?.filter(log => 
        log.output_data?.sources_processed && 
        log.input_data?.source_name === sourceId
      ) || [];

      const totalAttempts = sourceLogs.length;
      const successfulAttempts = sourceLogs.filter(log => 
        log.output_data?.total_comps > 0
      ).length;

      const avgResponseTime = sourceLogs.length > 0 
        ? sourceLogs.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / sourceLogs.length
        : null;

      return {
        ...source,
        success_rate: totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : null,
        avg_response_time_ms: avgResponseTime ? Math.round(avgResponseTime) : null,
        last_accessed: sourceLogs.length > 0 ? sourceLogs[0].created_at : null,
        total_attempts_24h: totalAttempts,
        successful_attempts_24h: successfulAttempts
      };
    });

    // Group sources by type
    const sourcesByType = sourceMetrics.reduce((acc, source) => {
      if (!acc[source.type]) {
        acc[source.type] = [];
      }
      acc[source.type].push(source);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate overall statistics
    const totalSources = MARKET_SOURCES.length;
    const activeSources = sourceMetrics.filter(s => s.status === 'active').length;
    const avgSuccessRate = sourceMetrics
      .filter(s => s.success_rate !== null)
      .reduce((sum, s) => sum + (s.success_rate || 0), 0) / 
      sourceMetrics.filter(s => s.success_rate !== null).length || 0;

    console.log(`✅ Sources data compiled: ${totalSources} total, ${activeSources} active`);

    return new Response(JSON.stringify({
      success: true,
      sources: sourceMetrics,
      sources_by_type: sourcesByType,
      statistics: {
        total_sources: totalSources,
        active_sources: activeSources,
        inactive_sources: totalSources - activeSources,
        avg_success_rate: Math.round(avgSuccessRate),
        last_updated: new Date().toISOString()
      },
      api: 'valuation-sources'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Sources API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'valuation-sources'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});