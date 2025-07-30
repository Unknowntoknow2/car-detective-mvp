import { OpenAI } from "openai";
import { decodeVIN } from "./vinDecoder";
import { getValuation } from "./valuationEngine";
import { SupabaseClient } from "@supabase/supabase-js";

// Initialize GPT-4o (OpenAI)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? undefined });

export interface ConversationState {
  vin?: string;
  details?: string;
  decodedData?: any;
  features?: string[];
  valuation?: {
    value: number;
    confidence: number;
    explanation: string;
  };
  flowStep: "awaitingInput" | "vinDecoded" | "collectingFeatures" | "showingValuation";
}

export class ConversationEngine {
  private state: ConversationState;
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.state = { flowStep: "awaitingInput" };
    this.supabase = supabase;
  }

  async processInput(input: string): Promise<ConversationState> {
    // Example: VIN input or natural language
    if (input.match(/^[A-HJ-NPR-Z0-9]{17}$/)) {
      this.state.vin = input;
      this.state.decodedData = await decodeVIN(input);
      this.state.flowStep = "vinDecoded";
      return this.state;
    }
    // Otherwise, ask GPT-4o to parse and extract vehicle details
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: input }],
    });
    this.state.details = aiResponse.choices[0].message.content ?? undefined;
    // Optionally decode VIN if present in details
    // ... more logic here ...
    return this.state;
  }

  async collectFeatures(features: string[]): Promise<ConversationState> {
    this.state.features = features;
    this.state.flowStep = "collectingFeatures";
    return this.state;
  }

  async runValuation(): Promise<ConversationState> {
    if (!this.state.decodedData) throw new Error("VIN data missing");
    const valuationResult = await getValuation(this.state.decodedData, this.state.features || []);
    this.state.valuation = valuationResult;
    this.state.flowStep = "showingValuation";
    return this.state;
  }
}