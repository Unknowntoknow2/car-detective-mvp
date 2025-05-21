
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/valuation-stats', () => {
    // Mocked data for valuation statistics
    const stats = {
      totalValuations: 150,
      totalPdfs: 50,
      premiumValuations: 30,
    };

    return HttpResponse.json(stats);
  }),
];
