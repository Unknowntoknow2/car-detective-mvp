
import { rest } from 'msw';

// Update this file to use the correct imports from msw
export const handlers = [
  rest.get('/api/example', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'This is a mocked response' })
    );
  }),
];
