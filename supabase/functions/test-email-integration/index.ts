import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requiredKeys = [
      "RESEND_API_KEY",
      "APP_URL", 
      "EMAIL_DOMAIN"
    ];

    const keyStatus = {};
    for (const key of requiredKeys) {
      const value = Deno.env.get(key);
      keyStatus[key] = {
        configured: !!value,
        value: value ? `${value.substring(0, 8)}...` : null
      };
    }

    // Test email service availability
    let emailServiceStatus = "unknown";
    if (Deno.env.get("RESEND_API_KEY")) {
      try {
        // Just test that we can import Resend
        const { Resend } = await import('npm:resend@2.0.0');
        const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
        emailServiceStatus = "ready";
      } catch (error) {
        emailServiceStatus = `error: ${error.message}`;
      }
    } else {
      emailServiceStatus = "not_configured";
    }

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      environment_variables: keyStatus,
      email_service_status: emailServiceStatus,
      test_completed: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});