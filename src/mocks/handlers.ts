
import { rest } from 'msw';

export const handlers = [
  // Mock any API endpoints that tests might use
  rest.get('/api/*', (req, res, ctx) => {
    return res(ctx.json({ message: 'Mock response' }));
  }),
];
