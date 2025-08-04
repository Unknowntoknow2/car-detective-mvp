const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/openai/chat', (req, res) => {
  res.json({ message: "OpenAI placeholder route works!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
