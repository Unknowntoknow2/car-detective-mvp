
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock API endpoints for testing
  http.get('/api/vehicles', () => {
    return HttpResponse.json([
      {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 45000,
      },
    ]);
  }),

  http.post('/api/valuations', () => {
    return HttpResponse.json({
      id: 'test-valuation-id',
      estimatedValue: 25000,
      confidenceScore: 85,
    });
  }),

  http.get('/api/vin/:vin', ({ params }) => {
    return HttpResponse.json({
      vin: params.vin,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      bodyStyle: 'Sedan',
    });
  }),
];
