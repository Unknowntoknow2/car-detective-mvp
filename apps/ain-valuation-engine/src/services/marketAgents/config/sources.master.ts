import fs from "fs";
import path from "path";

export type SourcePolicy = {
  tier: string;
  allowed: boolean;
  trust: number;
  freshnessDays: number;
  cacheTtlMs: number;
  maxRetries: number;
  stopOn429After: number;
  minDelayMs: number;
};

export type SourceRegistry = Record<string, SourcePolicy>;

export function loadSourceRegistry(): SourceRegistry {
  const file = path.resolve(__dirname, "./sources.master.json");
  const raw = fs.readFileSync(file, "utf-8");
  const parsed = JSON.parse(raw);
  // Optionally: validate structure here
  return parsed;
}
