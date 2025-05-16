
// Rate limiting variables
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestCounts: Record<string, { count: number; timestamp: number }> = {};

export default async function handler(
  req: Request
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // For IP-based rate limiting, we'd typically get the IP from headers
  // In this non-Next.js context, we'll use a simpler approach
  const clientIp = '0.0.0.0'; // In a real app, you'd extract this from request headers
  const now = Date.now();
  
  // Clean up old entries to prevent memory leaks
  Object.keys(ipRequestCounts).forEach(ip => {
    if (now - ipRequestCounts[ip].timestamp > RATE_LIMIT_WINDOW) {
      delete ipRequestCounts[ip];
    }
  });
  
  // Initialize or update request count for this IP
  if (!ipRequestCounts[clientIp]) {
    ipRequestCounts[clientIp] = { count: 0, timestamp: now };
  } else if (now - ipRequestCounts[clientIp].timestamp > RATE_LIMIT_WINDOW) {
    // Reset count if window has passed
    ipRequestCounts[clientIp] = { count: 0, timestamp: now };
  }
  
  // Check if rate limit exceeded
  if (ipRequestCounts[clientIp].count >= MAX_REQUESTS_PER_WINDOW) {
    return new Response(JSON.stringify({ 
      error: 'Too many requests. Please try again later.' 
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Increment request count
  ipRequestCounts[clientIp].count += 1;

  try {
    // Extract data from request body
    const { question, userContext, systemPrompt, chatHistory } = await req.json();
    
    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate question length
    if (question.trim().length > 1000) {
      return new Response(JSON.stringify({ error: 'Question is too long (max 1000 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt || `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights. 

Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.

Never guess. If info is missing (e.g., no valuation), ask for it clearly.

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.
        
${userContext ? `User context: ${JSON.stringify(userContext)}` : ''}`,
      },
    ];

    // Add chat history for context if available
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
    }

    // Add current question
    messages.push({
      role: 'user',
      content: question
    });

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OpenAI API key');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const responseData = await response.json();
    const answer = responseData.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
