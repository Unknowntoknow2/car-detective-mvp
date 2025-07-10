import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { logData } = await req.json()

    // FIX #6: Safe audit logging that handles RLS policies properly
    const auditEntry = {
      entity_type: 'valuation_pipeline',
      entity_id: logData.entityId || 'unknown',
      action: logData.action || 'valuation_step',
      input_data: logData.inputData || {},
      output_data: logData.outputData || {},
      data_sources_used: logData.dataSources || ['nhtsa', 'vin_enrichment'],
      processing_time_ms: logData.processingTimeMs || 0,
      user_id: logData.userId || null,
      session_id: logData.sessionId || null,
      ip_address: logData.ipAddress || null,
      user_agent: logData.userAgent || null,
      compliance_flags: logData.complianceFlags || [],
      retention_until: null // Let database set default
    }

    console.log('📝 Attempting to log audit entry:', auditEntry)

    // Try to insert audit log entry with service role bypass
    const { data, error } = await supabase
      .from('compliance_audit_log')
      .insert(auditEntry)
      .select()

    if (error) {
      console.error('❌ Audit log insertion failed:', error)
      // Don't throw error - continue without audit logging
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          warning: 'Audit logging failed but operation continued'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return success so main operation continues
        }
      )
    }

    console.log('✅ Audit entry logged successfully:', data?.[0]?.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        auditId: data?.[0]?.id,
        message: 'Audit logged successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Safe audit logger error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        warning: 'Audit logging failed but operation continued'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Don't fail the main operation
      }
    )
  }
})