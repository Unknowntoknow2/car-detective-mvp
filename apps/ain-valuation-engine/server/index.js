const express = require('express');
const logger = require('../src/utils/logger.js');
const { register } = require('../src/utils/metrics');
const app = express();
app.use(express.json());

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.post('/api/openai/chat', (req, res) => {
  res.json({ message: "OpenAI placeholder route works!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
