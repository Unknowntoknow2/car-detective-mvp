
import { rest } from 'msw';

// Define an array of request handlers
export const handlers = [
  // Mock Supabase auth endpoints
  rest.post('https://xltxqqzattxogxtqrggt.supabase.co/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
          app_metadata: { provider: 'email' },
          user_metadata: {},
          aud: 'authenticated'
        }
      })
    );
  }),
  
  // Mock Supabase data endpoints
  rest.get('https://xltxqqzattxogxtqrggt.supabase.co/rest/v1/valuations', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 'mock-valuation-id',
          make: 'Honda',
          model: 'Accord',
          year: 2020,
          mileage: 15000,
          estimated_value: 18000,
          condition_score: 85,
          confidence_score: 92,
          created_at: new Date().toISOString(),
          user_id: 'mock-user-id',
          premium_unlocked: false
        }
      ])
    );
  }),
  
  // Mock Supabase function invocation
  rest.post('https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/generate-valuation-pdf', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        url: 'https://example.com/mock-pdf.pdf'
      })
    );
  }),
  
  // Mock Stripe payment
  rest.post('https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/create-payment', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        url: 'https://checkout.stripe.com/mock-session'
      })
    );
  }),
  
  // Mock VIN lookup
  rest.get('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/:vin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        Results: [
          {
            Make: 'HONDA',
            Model: 'ACCORD',
            ModelYear: '2020',
            BodyClass: 'Sedan',
            FuelTypePrimary: 'Gasoline',
            TransmissionStyle: 'Automatic'
          }
        ]
      })
    );
  })
];
