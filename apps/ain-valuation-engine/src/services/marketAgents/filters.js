import { getHostFreshnessDays } from "./config/sources";
export function filterFresh(rows) {
    const now = Date.now();
    return rows.filter(r => {
        const host = (r.source || "").replace(/^https?:\/\/(www\.)?/, " ").split("/")[0];
        const days = getHostFreshnessDays(host);
        const ts = Date.parse(r.fetchedAt || "");
        return Number.isFinite(ts) ? (now - ts) <= days * 86400000 : true;
    });
}
