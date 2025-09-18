import { listHostsByTier } from "./config/policy";

export type RouteParams = { locale?: "us"|"intl"; vin?: string|null; make?:string; model?:string; year?:number; zip?:string; radius?:number };

export function routeDomains(p: RouteParams): { tier:string; domains:string[] }[] {
  const isUS = !p.zip || /^[0-9]{5}/.test(p.zip);
  const tiers: { tier:string; domains:string[] }[] = [];
  if (isUS) {
    tiers.push({ tier:"us_t1", domains: listHostsByTier("us_t1") });
    tiers.push({ tier:"oem", domains: listHostsByTier("oem") });
    tiers.push({ tier:"dealer_group", domains: listHostsByTier("dealer_group") });
    tiers.push({ tier:"us_t2", domains: listHostsByTier("us_t2") });
    tiers.push({ tier:"auction", domains: listHostsByTier("auction") });
    tiers.push({ tier:"specialty", domains: listHostsByTier("specialty") });
  } else {
    tiers.push({ tier:"intl", domains: listHostsByTier("intl") });
    tiers.push({ tier:"specialty", domains: listHostsByTier("specialty") });
  }
  return tiers;
}
