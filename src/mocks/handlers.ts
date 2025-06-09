
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock API endpoints for testing
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test endpoint' });
  }),
  
  // Add more mock handlers as needed for your tests
];
