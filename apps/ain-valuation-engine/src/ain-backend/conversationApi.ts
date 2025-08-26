import express from "express";
import { ConversationEngine } from "./conversationEngine.js";

const router = express.Router();

// POST /api/conversation/input
router.post("/input", async (req, res) => {
  try {
    const { input } = req.body;
    const engine = new ConversationEngine(); // Initialize with empty state
    const state = await engine.processInput(input);
    res.status(200).json(state);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// POST /api/conversation/features
router.post("/features", async (req, res) => {
  try {
    const { features } = req.body;
    const engine = new ConversationEngine(); // Initialize with empty state
    const state = await engine.collectFeatures(features);
    res.status(200).json(state);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// POST /api/conversation/valuate
router.post("/valuate", async (req, res) => {
  try {
    const engine = new ConversationEngine(); // Initialize with empty state
    const state = await engine.runValuation();
    res.status(200).json(state);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

export default router;
