
import type { NextApiRequest, NextApiResponse } from 'next';

// GPT_AI_ASSISTANT_V1
// Rate limiting variables
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestCounts: Record<string, { count: number; timestamp: number }> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Implement rate limiting
  const clientIp = req.headers['x-forwarded-for'] as string || '0.0.0.0';
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
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.' 
    });
  }
  
  // Increment request count
  ipRequestCounts[clientIp].count += 1;

  try {
    // Extract question from request body
    const { question, userContext, chatHistory } = req.body;
    
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Validate question length
    if (question.trim().length > 1000) {
      return res.status(400).json({ error: 'Question is too long (max 1000 characters)' });
    }

    // Prepare messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are CarDetective AI — an expert vehicle valuation assistant. Help users understand car prices, market trends, premium benefits, and car condition factors. Be concise, helpful, and non-repetitive.
        
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
      return res.status(500).json({ error: 'Server configuration error' });
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
      return res.status(500).json({ error: 'Failed to get AI response' });
    }

    const responseData = await response.json();
    const answer = responseData.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
