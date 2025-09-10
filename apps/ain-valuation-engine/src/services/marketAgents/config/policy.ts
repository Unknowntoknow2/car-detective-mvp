import presets from "./tierPresets.json" with { type: "json" };
import registry from "./sources.master.json" with { type: "json" };

export type Tier = keyof typeof presets;
export type Policy = { trust:number; freshnessDays:number; cacheTtlMs:number; maxRetries:number; stopOn429After:number; minDelayMs:number; tier:Tier; allowed:boolean };

export function getPolicyForHost(hostOrUrl: string): Policy | null {
  const host = hostOrUrl.replace(/^https?:\/\/(www\.)?/," ");
  const entry = (registry as Record<string, any>)[host] || (registry as Record<string, any>)[host.split("/")[0]];
  if (!entry) return null;
  const tier: Tier = entry.tier;
  const base = (presets as any)[tier] || (presets as any)["us_t1"];
  const merged = { ...base, ...entry, tier, allowed: entry.allowed !== false };
  return merged as Policy;
}

export function listHostsByTier(tier: Tier): string[] {
  return Object.entries(registry).filter(([,v]:any) => v.tier === tier).map(([k]) => k);
}

export function isAllowed(hostOrUrl:string){ const p=getPolicyForHost(hostOrUrl); return !!p?.allowed; }
