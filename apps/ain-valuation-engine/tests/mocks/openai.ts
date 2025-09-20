import { vi } from 'vitest';
class OpenAIClass {
  chat = { completions: { create: vi.fn() } };
  constructor() {}
}
function OpenAIFactory(...args) { return new OpenAIClass(...args); }
// make calling without `new` act like a class instance
(Object.assign(OpenAIFactory, OpenAIClass), (OpenAIFactory as any).prototype = OpenAIClass.prototype);
export default OpenAIFactory as unknown as typeof OpenAIClass;
