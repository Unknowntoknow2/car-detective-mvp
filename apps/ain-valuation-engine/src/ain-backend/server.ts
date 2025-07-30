import express from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from './logger';

const app = express();

const jokeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/joke', jokeLimiter, async (req, res) => {
  logger.info('Joke endpoint hit', { ip: req.ip });
  try {
    // Fetch joke from Official Joke API
    const joke = await fetchJoke();
    res.json(joke);
  } catch (error) {
    logger.error('Joke API error', { error });
    res.status(500).json({ error: 'Failed to fetch joke.' });
  }
});

// ...rest of your server code