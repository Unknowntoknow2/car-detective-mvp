
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/vehicles', () => {
    return HttpResponse.json([
      { id: '1', make: 'Toyota', model: 'Camry', year: 2020 },
      { id: '2', make: 'Honda', model: 'Accord', year: 2019 },
      { id: '3', make: 'Ford', model: 'F-150', year: 2021 },
    ]);
  }),
];
