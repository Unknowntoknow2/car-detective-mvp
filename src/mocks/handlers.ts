import { rest } from 'msw';

export const handlers = [
  rest.get('/api/valuation-stats', (req, res, ctx) => {
    // Mocked data for valuation statistics
    const stats = {
      totalValuations: 150,
      totalPdfs: 50,
      premiumValuations: 30,
    };

    return res(
      ctx.status(200),
      ctx.json(stats)
    );
  }),
];
