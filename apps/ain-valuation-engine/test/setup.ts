import { expect, vi } from 'vitest'

// Provide deterministic defaults for environment variables expected by the app.
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.VERCEL = process.env.VERCEL || '0'
process.env.AIN_API_URL = process.env.AIN_API_URL || 'http://localhost/_ain_disabled'
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost/_supabase_disabled'
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test_anon_key'
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test_service_role_key'
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test_openai_key'
process.env.VITE_OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY

const stubbedVinResult = {
  ErrorCode: '0',
  ErrorText: '',
  Make: 'Honda',
  Model: 'Accord',
  ModelYear: '2003',
  Trim: 'EX',
  Series: 'Accord',
  BodyClass: 'Sedan/Saloon',
  VehicleType: 'PASSENGER CAR',
  EngineCylinders: '4',
  EngineHP: '160',
  DisplacementCC: '2354',
  DisplacementL: '2.4',
  FuelTypePrimary: 'Gasoline',
  FuelTypeSecondary: 'None',
  DriveType: 'FWD/Front-Wheel Drive',
  TransmissionStyle: 'Automatic',
  TransmissionSpeeds: '5',
  Manufacturer: 'Honda',
  PlantCity: 'Sayama',
  PlantState: '',
  PlantCountry: 'Japan',
  PlantCompanyName: 'Honda Motor Co., Ltd',
  Doors: '4',
  Seats: '5',
  SeatRows: '2',
  GVWR: 'Class 1A: 3,000 lb or less (1,360 kg or less)',
  GVWRFrom: '0',
  GVWRTo: '3000',
  BatteryType: 'Lead Acid',
  ElectrificationLevel: 'None',
  ABS: 'Standard',
  ESC: 'Standard',
  TPMS: 'Standard',
  AdaptiveCruiseControl: 'Standard',
  LaneKeepSystem: 'Standard',
  ForwardCollisionWarning: 'Standard',
  BlindSpotMon: 'Standard',
  KeylessIgnition: 'Yes',
}

// Block real network access by default. Allow explicit localhost calls for fixtures.
const realFetch = typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined
const allowLocalhost = /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)/i

const toAbortError = () => {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('Aborted', 'AbortError')
  }
  const error = new Error('Aborted')
  error.name = 'AbortError'
  return error
}

const createJsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

const resolveWithSignal = (signal: AbortSignal | null | undefined, factory: () => Response) => {
  if (!signal) {
    return Promise.resolve(factory())
  }

  return new Promise<Response>((resolve, reject) => {
    if (signal.aborted) {
      reject(toAbortError())
      return
    }

    const abortHandler = () => {
      signal.removeEventListener('abort', abortHandler)
      reject(toAbortError())
    }

    signal.addEventListener('abort', abortHandler, { once: true })

    setTimeout(() => {
      signal.removeEventListener('abort', abortHandler)
      resolve(factory())
    }, 5)
  })
}

type FetchArgs = [input: any, init?: any]

const blockingFetch = vi.fn(async (...args: FetchArgs) => {
  const [input, init] = args
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input && typeof input === 'object' && 'url' in input
          ? (input as { url: string }).url
          : ''

  if (url.startsWith('https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/')) {
    return resolveWithSignal(init?.signal, () => createJsonResponse({ Results: [stubbedVinResult] }))
  }

  if (url.includes('/functions/v1/decode-vin')) {
    return resolveWithSignal(init?.signal, () => createJsonResponse({ decodedData: [stubbedVinResult] }))
  }

  if (!url || url.startsWith('/') || allowLocalhost.test(url)) {
    if (realFetch) {
      return realFetch(input as any, init as any)
    }

    if (typeof Response !== 'undefined') {
      return new Response(null, { status: 200 })
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '',
    } as any
  }

  throw new Error(`Network disabled in tests: ${url}`)
})

globalThis.fetch = blockingFetch as unknown as typeof fetch

// Shim legacy Jest globals still referenced by some tests.
// @ts-ignore - Vitest exposes the same API surface for our usage.
globalThis.jest = vi as unknown as typeof vi
globalThis.fail = (message?: string) => {
  throw new Error(message || 'Test failed')
}

expect.extend({})

// Ensure heavyweight integrations are mocked out globally.
vi.mock('openai')

vi.mock('@supabase/supabase-js')
