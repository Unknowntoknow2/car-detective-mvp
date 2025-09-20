import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
// @ts-nocheck
const got = __require("got");
import { extractListingsFromHtml } from "./extractors/openaiExtractor.js";
import { cleanNumbers } from "./utils/numbers.js";
import { toIso } from "./utils/time.js";
import { isAllowedHost, getHostPolicy, getHostCacheTtlMs } from "./config/sources.js";
import { limiterFor } from "./utils/throttle.js";
import { getCached, setCached } from "./utils/cache.js";
export async function fetchAndExtract(urls, model = "gpt-4o-mini") {
    const rows = [];
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
                html = await limiterFor(host, getHostPolicy(host)).run(() => withRetry(() => got(url, {
                    timeout: { request: 15_000 },
                    headers: { "user-agent": "AINValuationBot/1.0 (+contact: support@ain.example)" }
                }).then(res => res.body)));
                setCached(url, html, getHostCacheTtlMs(host));
            }
            const { listings, tokensIn: ti, tokensOut: to } = await extractListingsFromHtml({ html, url, nowISO, model });
            if (ti)
                tokensIn += ti;
            if (to)
                tokensOut += to;
            for (const l of listings) {
                // light normalization
                l.price = cleanNumbers(l.price);
                l.mileage = cleanNumbers(l.mileage);
            }
            rows.push(...listings);
        }
        catch (e) {
            console.warn(`[fetch] ${url} -> ${e.message}`);
        }
    }
    return { rows, tokensIn, tokensOut };
}
