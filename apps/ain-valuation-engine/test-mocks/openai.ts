import { vi } from "vitest";
const create = vi.fn();
export default function OpenAI() {
  return { chat: { completions: { create } } };
}
export { create };
