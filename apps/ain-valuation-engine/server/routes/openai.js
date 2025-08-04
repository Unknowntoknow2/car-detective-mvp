const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    res.json(chat);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
