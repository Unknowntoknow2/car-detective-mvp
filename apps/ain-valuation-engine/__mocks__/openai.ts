import { vi } from 'vitest';

const create = vi.fn();

class OpenAI {
  chat = { completions: { create } };
  constructor(..._args: any[]) {}
}

function OpenAIFactory(...args: any[]) {
  return new OpenAI(...args);
}
// Make calling it as a function still carry the class prototype
(OpenAIFactory as any).prototype = OpenAI.prototype;

export default OpenAIFactory as unknown as typeof OpenAI;
export { create };
