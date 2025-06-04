<<<<<<< HEAD

import { http, HttpResponse } from 'msw';
=======
import { rest } from "msw";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export const handlers = [
<<<<<<< HEAD
  http.get('/api/valuation-stats', () => {
    // Mocked data for valuation statistics
    const stats = {
      totalValuations: 150,
      totalPdfs: 50,
      premiumValuations: 30,
    };

    return HttpResponse.json(stats);
=======
  rest.get("/api/example", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: "This is a mocked response" }),
    );
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }),
];
