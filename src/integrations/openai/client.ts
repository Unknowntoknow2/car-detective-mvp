
import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('Missing OpenAI API key. Please set VITE_OPENAI_API_KEY environment variable.');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true // Only for development - in production use server-side
});

export default openai;
