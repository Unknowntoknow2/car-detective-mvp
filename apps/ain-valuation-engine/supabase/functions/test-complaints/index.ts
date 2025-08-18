// @ts-ignore Deno std remote import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const params = await req.json();
    console.log('Received params:', params);
    
    // Simple test response
    return new Response(JSON.stringify({
      success: true,
      message: 'Test complaints function working',
      received: params,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
