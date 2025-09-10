import { vi, expect } from 'vitest'

// Provide a minimal Jest shim for legacy tests
// @ts-ignore
globalThis.jest = vi as unknown as typeof vi
// Some tests call global `fail()`
globalThis.fail = (msg?: string) => { throw new Error(msg || 'Test failed') }

// Ensure expect is available (globals:true already does this, but keep import)
expect.extend({})
