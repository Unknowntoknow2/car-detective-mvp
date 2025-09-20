import { vi } from 'vitest';
export default function OpenAI() {
  return {
    chat: {
      completions: {
        create: vi.fn(async ({ messages }) => ({
          choices: [{
            message: { content: messages?.[0]?.content ? `mock:${messages[0].content}` : 'mock' }
          }]
        }))
      }
    }
  };
}
