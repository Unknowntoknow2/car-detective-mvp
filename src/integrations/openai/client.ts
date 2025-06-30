
let openai: any;

try {
  const OpenAI = require('openai');
  
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API key. Please set VITE_OPENAI_API_KEY environment variable.');
  }

  openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true // Only for development - in production use server-side
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
  openai = null;
}

export { openai };
export default openai;
