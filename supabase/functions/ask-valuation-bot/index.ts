
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// OpenAI API configuration
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GPT_MODEL = 'gpt-4o'; // Using gpt-4o for best results

// Request handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      throw new Error('Unauthorized request');
    }

    // Parse request data
    const { session_id, user_input, valuation_id, new_session } = await req.json();
    
    // Create a new chat session if requested
    let sessionId = session_id;
    if (new_session && valuation_id) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          valuation_id: valuation_id
        })
        .select('id')
        .single();
        
      if (sessionError) {
        throw new Error(`Failed to create chat session: ${sessionError.message}`);
      }
      sessionId = newSession.id;
    }

    if (!sessionId) {
      throw new Error('No session ID provided and no new session requested');
    }

    // Fetch chat history for context
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);
      
    if (historyError) {
      throw new Error(`Failed to fetch chat history: ${historyError.message}`);
    }

    // Fetch valuation data for context
    let valuationData = null;
    let valId = valuation_id;
    
    if (!valId) {
      // Try to get valuation_id from the session
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('valuation_id')
        .eq('id', sessionId)
        .single();
        
      if (sessionError) {
        throw new Error(`Failed to fetch session data: ${sessionError.message}`);
      }
      
      valId = sessionData.valuation_id;
    }
    
    if (valId) {
      const { data: valuation, error: valuationError } = await supabase
        .from('valuations')
        .select('*, photo_condition_scores(*)')
        .eq('id', valId)
        .single();
        
      if (!valuationError && valuation) {
        valuationData = valuation;
      }
    }

    // Store user's message
    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: user_input
      });
      
    if (insertError) {
      throw new Error(`Failed to store user message: ${insertError.message}`);
    }

    // Create context for the OpenAI prompt
    const messages = [];
    
    // System prompt
    const systemPrompt = `You are Car Detective, a certified expert in U.S. automotive pricing, trusted by sellers and buyers for transparent valuations.

You always:
• Explain valuations in plain English
• Justify why the price makes sense
• Recommend ways to increase value
• Can answer questions like:
  - Why is my price low?
  - Would a clean CARFAX help?
  - Is this ZIP code lowering my value?
  - What can I do to get a better offer?

NEVER hallucinate. Use only provided valuation data. If unsure, say 'I'm not sure, but I can explain what I know.'`;

    messages.push({ role: 'system', content: systemPrompt });

    // Add valuation context if available
    if (valuationData) {
      // Format adjustments for the context
      const adjustments = [];
      
      // Mileage adjustment
      if (valuationData.mileage) {
        adjustments.push({
          factor: 'Mileage',
          impact: calculateMileageImpact(valuationData.mileage),
          description: `${valuationData.mileage.toLocaleString()} miles`
        });
      }
      
      // Condition adjustment
      if (valuationData.condition_score) {
        adjustments.push({
          factor: 'Condition',
          impact: calculateConditionImpact(valuationData.condition_score),
          description: getConditionLabel(valuationData.condition_score)
        });
      }
      
      // ZIP market adjustment
      if (valuationData.zip_demand_factor) {
        adjustments.push({
          factor: 'Regional Market',
          impact: Math.round((valuationData.zip_demand_factor - 1) * 100),
          description: 'Local market demand'
        });
      }
      
      // AI condition data
      let aiCondition = null;
      if (valuationData.photo_condition_scores && valuationData.photo_condition_scores.length > 0) {
        const conditionScore = valuationData.photo_condition_scores[0];
        aiCondition = {
          condition: getConditionRating(conditionScore.condition_score || 0),
          confidenceScore: conditionScore.confidence_score || 0,
          issuesDetected: conditionScore.issues || [],
          summary: conditionScore.summary || ''
        };
      }
      
      // Create a context object for valuation data
      const contextObj = {
        vehicle: `${valuationData.year} ${valuationData.make} ${valuationData.model}`,
        baseValue: valuationData.base_price || 0,
        mileage: valuationData.mileage || 0,
        zip: valuationData.state || '',
        adjustments: adjustments,
        estimatedValue: valuationData.estimated_value || 0,
        aiCondition: aiCondition
      };
      
      // Add context as a message
      messages.push({
        role: 'system',
        content: `Here is the vehicle valuation data:\n${JSON.stringify(contextObj, null, 2)}`
      });
    } else {
      // Add a fallback context for cases with no valuation
      messages.push({
        role: 'system',
        content: 'No specific valuation data is available for this conversation. Provide general guidance about car valuations based on industry knowledge.'
      });
    }

    // Add conversation history
    for (const msg of chatHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add the current user's question
    messages.push({ role: 'user', content: user_input });

    // Call OpenAI API
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: GPT_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const gptResponse = await openAIResponse.json();
    const assistantMessage = gptResponse.choices[0].message.content;

    // Store assistant's response
    const { error: responseError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage
      });
      
    if (responseError) {
      throw new Error(`Failed to store assistant response: ${responseError.message}`);
    }

    // Return response
    return new Response(
      JSON.stringify({
        message: assistantMessage,
        session_id: sessionId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in ask-valuation-bot:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Helper functions
function getConditionLabel(score: number): string {
  if (!score) return 'Unknown';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function getConditionRating(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function calculateConditionImpact(score: number): number {
  if (!score) return 0;
  if (score >= 85) return 10;
  if (score >= 70) return 5;
  if (score >= 50) return 0;
  return -10;
}

function calculateMileageImpact(mileage: number): number {
  if (!mileage) return 0;
  if (mileage < 10000) return 15;
  if (mileage < 30000) return 10;
  if (mileage < 60000) return 5;
  if (mileage < 100000) return 0;
  if (mileage < 150000) return -5;
  if (mileage < 200000) return -10;
  return -20;
}
