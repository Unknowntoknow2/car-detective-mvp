// @ts-nocheck
import got = require("got");
import { extractListingsFromHtml } from "./extractors/openaiExtractor";
import type { Listing } from "./schemas/ListingSchema";
import { cleanNumbers } from "./utils/numbers";
import { toIso } from "./utils/time";
import { isAllowedHost, getHostPolicy, getHostCacheTtlMs } from "./config/sources";
import { limiterFor } from "./utils/throttle";
import { getCached, setCached } from "./utils/cache";

export async function fetchAndExtract(urls: string[], model = "gpt-4o-mini"): Promise<Listing[]> {

  const rows: Listing[] = [];
  let tokensIn = 0, tokensOut = 0;
  const nowISO = toIso(new Date());

  for (const url of urls) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      if (!isAllowedHost(host)) {
        console.warn(`[skip] ${host} not in allowlist`);
        continue;
      }
      // Use fetch cache if available
      let html = getCached(url);
      if (!html) {
        html = await limiterFor(host, getHostPolicy(host)).run(() => withRetry(() =>
          got(url, {
            timeout: { request: 15_000 },
            headers: { "user-agent": "AINValuationBot/1.0 (+contact: support@ain.example)" }
          }).then(res => res.body as string)
        ));
        setCached(url, html, getHostCacheTtlMs(host));
      }

      const { listings, tokensIn: ti, tokensOut: to } = await extractListingsFromHtml({ html, url, nowISO, model });
      if (ti) tokensIn += ti;
      if (to) tokensOut += to;
      for (const l of listings) {
        // light normalization
        l.price   = cleanNumbers(l.price);
        l.mileage = cleanNumbers(l.mileage);
      }
      rows.push(...listings);
    } catch (e: any) {
      console.warn(`[fetch] ${url} -> ${e.message}`);
    }
  }
  return { rows, tokensIn, tokensOut };
  const nowISO = toIso(new Date());

  for (const url of urls) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      if (!isAllowedHost(host)) {
        console.warn(`[skip] ${host} not in allowlist`);
        continue;
      }
      const html = await limiterFor(host).run(() =>
        got(url, {
          timeout: { request: 15_000 },
          headers: { "user-agent": "AINValuationBot/1.0 (+contact: support@ain.example)" }
        }).then(res => res.body as string)
      );

      const listings = await extractListingsFromHtml({ html, url, nowISO, model });
      for (const l of listings) {
        // light normalization
        l.price   = cleanNumbers(l.price);
        l.mileage = cleanNumbers(l.mileage);
      }
      out.push(...listings);
    } catch (e: any) {
      console.warn(`[fetch] ${url} -> ${e.message}`);
    }
  }
  return out;
}
