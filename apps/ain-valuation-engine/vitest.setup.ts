import { vi, test, expect } from "vitest";

/* env defaults */
process.env.VITE_OPENAI_API_KEY ||= "test-openai-key";
process.env.VITE_SUPABASE_URL ||= "http://127.0.0.1:54321";
process.env.VITE_SUPABASE_ANON_KEY ||= "anon-test-key";
process.env.SUPABASE_SERVICE_ROLE_KEY ||= "service-role-test-key";

/* fetch polyfill */
if (typeof fetch !== "function") {
  const nf = (await import("node-fetch")).default as unknown as typeof fetch;
  // @ts-ignore
  global.fetch = nf;
}

/* jest shim */
(globalThis as any).jest = {
  ...vi,
  fn: vi.fn,
  spyOn: vi.spyOn,
  clearAllMocks: vi.clearAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  mock: vi.mock,
};

/* Deno shim */
(globalThis as any).Deno = {
  test: (nameOrFn: any, maybeFn?: any) => {
    const name = typeof nameOrFn === "string" ? nameOrFn : (nameOrFn?.name || "Deno test");
    const fn = typeof maybeFn === "function" ? maybeFn : nameOrFn;
    return test(name, fn);
  },
  env: { get: (k: string) => process.env[k] },
};
