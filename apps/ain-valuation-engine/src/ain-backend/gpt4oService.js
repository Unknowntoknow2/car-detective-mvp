import logger from '../utils/logger.js';

const TEST_MODE = process.env.AIN_TEST_MODE === '1' || process.env.NODE_ENV === 'test';
let openai = null;

if (!TEST_MODE) {
  const OpenAI = (await import('openai')).default;
  openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  });
}

export async function summarize(text) {
  if (TEST_MODE) return 'stub summary';
  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: `summarize: ${text}` }],
  });
  return choices?.[0]?.message?.content || '';
}
