
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock API handlers for testing
  http.get('/api/vehicles/*', () => {
    return HttpResponse.json({ success: true, data: {} });
  }),
  
  http.post('/api/vehicles', () => {
    return HttpResponse.json({ success: true, data: { id: 'test-id' } });
  }),
];
