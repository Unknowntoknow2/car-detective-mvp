
import { http, HttpResponse } from 'msw';

// Define your mock handlers
export const handlers = [
  // Example handler for VIN lookup
  http.get('/api/vin/:vin', ({ params }) => {
    const vin = params.vin as string;
    
    return HttpResponse.json({
      vin,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      trim: 'LE'
    });
  }),
  
  // Example handler for valuations
  http.post('/api/valuations', async ({ request }) => {
    const data = await request.json();
    
    return HttpResponse.json({
      id: `val-${Date.now()}`,
      ...data,
      estimatedValue: 25000,
      confidenceScore: 85
    });
  }),
  
  // Get valuation by ID
  http.get('/api/valuations/:id', ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      id,
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      estimatedValue: 22500,
      confidenceScore: 90
    });
  })
];
