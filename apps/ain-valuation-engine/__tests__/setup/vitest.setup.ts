import { vi } from 'vitest';
vi.mock('openai', () => {
  const create = vi.fn();
  const OpenAI = function () {
    return { chat: { completions: { create } } };
  };
  return { default: OpenAI, __esModule: true };
});
