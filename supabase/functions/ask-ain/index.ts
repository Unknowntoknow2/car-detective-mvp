
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, vinContext, chatHistory = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );

    let systemPrompt = `You are AIN (Automotive Intelligence Network), an expert automotive assistant specializing in vehicle valuations, market analysis, and automotive advice. You provide professional, accurate, and helpful information about vehicles, their values, market conditions, and automotive decisions.

Your core capabilities:
- Vehicle valuation analysis and market insights
- Automotive history interpretation and risk assessment
- Negotiation strategies and buying/selling advice
- Technical automotive knowledge and maintenance guidance
- Market trend analysis and pricing predictions

Communication style:
- Professional yet approachable
- Data-driven with clear explanations
- Honest about limitations and uncertainties
- Practical and actionable advice`;

    // Add enriched data context if available
    if (vinContext) {
      systemPrompt += `\n\nCurrent vehicle context:`;
      
      if (vinContext.make && vinContext.model && vinContext.year) {
        systemPrompt += `\nVehicle: ${vinContext.year} ${vinContext.make} ${vinContext.model}`;
      }
      
      if (vinContext.vin) {
        systemPrompt += `\nVIN: ${vinContext.vin}`;
      }
      
      if (vinContext.mileage) {
        systemPrompt += `\nMileage: ${vinContext.mileage.toLocaleString()} miles`;
      }
      
      if (vinContext.condition) {
        systemPrompt += `\nCondition: ${vinContext.condition}`;
      }
      
      if (vinContext.estimatedValue) {
        systemPrompt += `\nEstimated Value: $${vinContext.estimatedValue.toLocaleString()}`;
      }
      
      if (vinContext.zipCode) {
        systemPrompt += `\nLocation: ${vinContext.zipCode}`;
      }

      // Check if user has premium access and fetch enriched data
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && vinContext.vin) {
          // Get user profile to check premium access
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_premium_dealer')
            .eq('id', user.id)
            .single();

          const hasPremiumAccess = profile && (
            ['premium', 'dealer', 'admin'].includes(profile.role) || 
            profile.is_premium_dealer
          );

          if (hasPremiumAccess) {
            // Fetch enriched data
            const { data: enrichedResponse } = await supabase.functions.invoke('enrichment-cache', {
              body: { vin: vinContext.vin, source: 'statvin' }
            });

            if (enrichedResponse?.data) {
              const statVin = enrichedResponse.data;
              
              systemPrompt += `\n\nSTAT.vin auction and history data for VIN ${vinContext.vin}:`;
              
              // Auction history
              if (statVin.auctionSalesHistory && statVin.auctionSalesHistory.length > 0) {
                const latestAuction = statVin.auctionSalesHistory[0];
                systemPrompt += `\n- Last Auction Sale: $${latestAuction.price?.toLocaleString() || 'N/A'} (${latestAuction.date || 'N/A'})`;
                systemPrompt += `\n- Auction Status: ${latestAuction.status || 'N/A'}`;
                systemPrompt += `\n- Location: ${latestAuction.location || 'N/A'}`;
                systemPrompt += `\n- Auction House: ${latestAuction.auction || 'N/A'}`;
              }
              
              // Damage history
              if (statVin.damageHistory && statVin.damageHistory.length > 0) {
                systemPrompt += `\n- Damage Records: ${statVin.damageHistory.length} incidents found`;
                statVin.damageHistory.slice(0, 3).forEach(damage => {
                  systemPrompt += `\n  • ${damage.date}: ${damage.severity} damage - ${damage.description}`;
                });
              }
              
              // Title history
              if (statVin.titleHistory && statVin.titleHistory.length > 0) {
                const latestTitle = statVin.titleHistory[0];
                systemPrompt += `\n- Title Status: ${latestTitle.titleType} (${latestTitle.state})`;
              }
              
              // Ownership history
              if (statVin.ownershipHistory && statVin.ownershipHistory.length > 0) {
                systemPrompt += `\n- Previous Owners: ${statVin.ownershipHistory.length}`;
                const latestOwner = statVin.ownershipHistory[0];
                if (latestOwner.ownerType) {
                  systemPrompt += ` (Last: ${latestOwner.ownerType})`;
                }
              }
              
              // Summary insights
              if (statVin.summaries) {
                const summary = statVin.summaries;
                const issues = [];
                if (summary.hasStructuralDamage) issues.push('structural damage');
                if (summary.hasSalvageTitle) issues.push('salvage title');
                if (summary.hasAirbagDeployment) issues.push('airbag deployment');
                if (summary.hasOdometerIssues) issues.push('odometer issues');
                
                if (issues.length > 0) {
                  systemPrompt += `\n- Risk Factors: ${issues.join(', ')}`;
                }
              }
              
              systemPrompt += `\n\nUse this comprehensive auction and title history to provide expert analysis about the vehicle's past, potential risks, and how these factors affect current market value and negotiation strategies. Highlight significant damage, title brands, or ownership patterns that buyers should be aware of.`;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching enriched data for AIN:', error);
        // Continue without enriched data if there's an error
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with enriched context');

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const completion = await openAIResponse.json();
    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      throw new Error('No response generated');
    }

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ask-ain function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
