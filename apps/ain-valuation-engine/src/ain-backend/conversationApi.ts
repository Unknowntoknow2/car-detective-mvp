import express from "express";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { ConversationEngine } from "./conversationEngine";

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

const engine = new ConversationEngine(supabase);

// POST /api/conversation/input
router.post("/input", async (req, res) => {
  try {
    const { input } = req.body;
    const state = await engine.processInput(input);
    res.status(200).json(state);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/conversation/features
router.post("/features", async (req, res) => {
  try {
    const { features } = req.body;
    const state = await engine.collectFeatures(features);
    res.status(200).json(state);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/conversation/valuate
router.post("/valuate", async (req, res) => {
  try {
    const state = await engine.runValuation();
    res.status(200).json(state);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
