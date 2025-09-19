// Lightweight loader for the allowlisted sources.
// Only domains with allowed=true will be queried.
import { SOURCES_DATA } from "./sourcesData";
export type SourcePolicy = { allowed: boolean; maxConcurrent?: number; minDelayMs?: number; freshnessDays?: number; cacheTtlMs?: number };
export function getHostFreshnessDays(hostname: string): number {
  const h = hostname.replace(/^www\./, "");
  const p = SOURCE_POLICIES[h];
  const def = Number(process.env.AIN_FRESHNESS_DAYS ?? 30);
  return Number(p?.freshnessDays ?? def);
}

export function getHostCacheTtlMs(hostname: string): number {
  const h = hostname.replace(/^www\./, "");
  const p = SOURCE_POLICIES[h];
  const def = Number(process.env.AIN_FETCH_TTL_MS ?? 10 * 60 * 1000);
  return Number(p?.cacheTtlMs ?? def);
}
export function getHostPolicy(hostname: string): { maxConcurrent: number; minDelayMs: number } {
  const h = hostname.replace(/^www\./, "");
  const p = SOURCE_POLICIES[h];
  const def = {
    maxConcurrent: Number(process.env.AIN_THROTTLE_MAX_CONCURRENCY ?? 2),
    minDelayMs: Number(process.env.AIN_THROTTLE_MIN_DELAY_MS ?? 250)
  };
  if (!p) return def;
  return {
    maxConcurrent: Number(p.maxConcurrent ?? def.maxConcurrent),
    minDelayMs: Number(p.minDelayMs ?? def.minDelayMs)
  };
}
export const SOURCE_POLICIES: Record<string, SourcePolicy> = SOURCES_DATA as Record<string, SourcePolicy>;

export function isAllowedHost(hostname: string): boolean {
  const h = hostname.replace(/^www\./, "");
  const policy = SOURCE_POLICIES[h];
  return !!(policy && policy.allowed);
}
