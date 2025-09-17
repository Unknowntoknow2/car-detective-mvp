import { describe, expect, it } from 'vitest'

describe('hermetic test harness', () => {
  it('bootstraps with default env and mocked fetch', () => {
    expect(process.env.SUPABASE_ANON_KEY).toBeTruthy()
    expect(typeof fetch).toBe('function')
  })
})
