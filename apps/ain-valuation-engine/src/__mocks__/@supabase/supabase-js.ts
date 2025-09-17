import { vi } from 'vitest'

const noError = () => ({ data: null, error: null })

export const createClient = vi.fn(() => ({
  from: vi.fn(() => ({
    insert: vi.fn(async () => noError()),
    select: vi.fn(async () => ({ data: [], error: null })),
    update: vi.fn(async () => noError()),
    delete: vi.fn(async () => noError()),
  })),
  auth: {
    getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
  },
}))

export type SupabaseClientMock = ReturnType<typeof createClient>
