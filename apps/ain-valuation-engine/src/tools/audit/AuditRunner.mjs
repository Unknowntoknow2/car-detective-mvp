/*
 * AIN Listings & Data Fetch Audit Runner (ESM, no external deps)
 * Scans the repo for anything that touches: discovery → fetch → extract → normalize → validate → dedupe → upsert → valuation.
 * Emits: AUDIT_INDEX.json, AUDIT_REPORT.md, GAPS_FIXLIST.md
 */
import { promises as fs } from "fs";
import { createInterface } from "readline";
import { join, resolve } from "path";
const ROOT = resolve(".");
const SCAN_DIRS = ["src", "scripts", "engine", "val_engine", "python", "providers"];
const EXT = new Set([".ts", ".tsx", ".mts", ".js", ".jsx", ".mjs", ".py"]);
const PATTERNS = {
    // baseline fields
    make: /\bmake\b/i,
    model: /\bmodel\b/i,
    year: /\byear\b/i,
    price: /\bprice\b/i,
    mileage: /\bmileage\b/i,
    vin: /\bvin\b/i,
    photos: /\b(photos?|image|imgUrl|primaryImage)\b/i,
    dealer: /\bdealer(Name|Phone)?\b/i,
    zip: /\b(zip|postal|postcode)\b/i,
    url: /\burl\b/i,
    // fetch / http
    fetch: /\b(fetch\(|axios\.|got\(|requests\.|httpx\.)/i,
    retry: /\b(retry|backoff|exponential|429|rate[\s_-]?limit|timeout)\b/i,
    // openai
    openai: /\b(openai|responses\.create|response_format|json_schema|gpt-|oai-)\b/i,
    // schema / validation
    schema: /\b(zod|TypeBox|pydantic|schema|response_format|json_schema)\b/i,
    // dedupe / identity
    dedupe: /\b(dedupe|unique|md5|sha256|hash|on\s+conflict)\b/i,
    // storage
    storage: /\b(supabase|prisma|knex|sequelize|insert|upsert|from\(|into\b)\b/i,
    // valuation usage
    valuation: /\b(valuation|comps?|median|iqr|bucket|cohort)\b/i,
    // config
    env: /\b(process\.env|\.env|tsconfig|package\.json|Airflow|DAG)\b/i,
};
const FN_SIG = /\b(function|const|let|async)\s+([A-Za-z0-9_]+)\s*(\(|=)/;
const EXPORT_SIG = /\bexport\s+(?:default\s+)?(?:class|function|const|type|interface)\s+([A-Za-z0-9_]+)/;
async function* walk(dir) {
    let list = [];
    try {
        list = await fs.readdir(dir);
    }
    catch {
        return;
    }
    for (const name of list) {
        const full = join(dir, name);
        let stat;
        try {
            stat = await fs.stat(full);
        }
        catch {
            continue;
        }
        if (stat.isDirectory()) {
            yield* walk(full);
        }
        else {
            if (Array.from(EXT).some(ext => full.endsWith(ext)))
                yield full;
        }
    }
}
async function scanFile(path) {
    const file = await fs.open(path, "r");
    const rl = createInterface({ input: file.createReadStream(), crlfDelay: Infinity });
    const hits = {};
    Object.keys(PATTERNS).forEach(k => (hits[k] = []));
    const functions = [];
    const exports = [];
    let loc = 0;
    for await (const lineText of rl) {
        loc++;
        for (const [k, re] of Object.entries(PATTERNS)) {
            if (re.test(lineText))
                hits[k].push({ file: path, line: loc, text: lineText.trim().slice(0, 240) });
        }
        const f = lineText.match(FN_SIG);
        if (f) {
            const name = f[2];
            functions.push({ name, lines: `${loc}-${loc}` });
        }
        const ex = lineText.match(EXPORT_SIG);
        if (ex)
            exports.push(ex[1]);
    }
    await rl.close();
    await file.close();
    return { path, loc, exports, functions, hits };
}
function progress(done, total, label) {
    const width = 24;
    const filled = Math.round((done / Math.max(total, 1)) * width);
    const bar = "▰".repeat(filled) + "▱".repeat(width - filled);
    process.stdout.write(`\r${label} ${bar} ${done}/${total}`);
    if (done === total)
        process.stdout.write("\n");
}
function summarize(files) {
    const counts = {};
    const baseline = ["make", "model", "year", "price", "mileage", "vin", "photos", "dealer", "zip", "url"];
    const coverage = {};
    for (const k of Object.keys(PATTERNS))
        counts[k] = 0;
    for (const f of files) {
        for (const [k, hits] of Object.entries(f.hits))
            counts[k] += hits.length;
        const found = new Set();
        for (const b of baseline)
            if ((f.hits[b]?.length ?? 0) > 0)
                found.add(b);
        coverage[f.path] = found.size;
    }
    return { counts, baselineCoverage: coverage };
}
async function writeArtifacts(idx) {
    await fs.writeFile("AUDIT_INDEX.json", JSON.stringify(idx, null, 2));
    // REPORT
    const lines = [];
    lines.push(`# AIN Listings & Data Fetch Audit Report`);
    lines.push(`Scanned: ${idx.repoRoot}`);
    lines.push(`When: ${idx.scannedAt}`);
    lines.push(`Total files: ${idx.files.length}`);
    lines.push("");
    lines.push(`## Summary Signals`);
    for (const [k, v] of Object.entries(idx.summary.counts)) {
        lines.push(`- ${k}: ${v}`);
    }
    lines.push("");
    lines.push(`## Files (top signals)`);
    for (const f of idx.files) {
        const score = Object.values(f.hits).reduce((s, arr) => s + (arr?.length ?? 0), 0);
        if (score === 0)
            continue;
        lines.push(`### ${f.path}  (LOC ${f.loc})`);
        if (f.exports?.length)
            lines.push(`exports: ${f.exports.join(", ")}`);
        if (f.functions.length)
            lines.push(`functions: ${f.functions.map(fn => fn.name).join(", ")}`);
        for (const [k, arr] of Object.entries(f.hits)) {
            if (!arr.length)
                continue;
            if (!["fetch", "openai", "schema", "dedupe", "storage", "retry", "make", "model", "year", "price", "mileage", "vin", "photos", "dealer", "zip", "url", "valuation", "env"].includes(k))
                continue;
            lines.push(`- **${k}** (${arr.length})`);
            for (const h of arr.slice(0, 5))
                lines.push(`  - L${h.line}: ${h.text}`);
        }
        lines.push("");
    }
    await fs.writeFile("AUDIT_REPORT.md", lines.join("\n"));
    // GAPS
    const gaps = [];
    gaps.push(`# GAPS_FIXLIST.md`);
    gaps.push(`- Verify all baseline fields are present in every listings path (make, model, year, price, mileage, VIN?, ZIP?, photo, dealer?, url).`);
    gaps.push(`- Ensure dedupe key = VIN else composite(md5(make,model,~year,~price,~mileage,zip,source)).`);
    gaps.push(`- Mark required fields in schema; nullables guarded in mappers.`);
    gaps.push(`- Add retry/backoff around all HTTP calls lacking it; rate caps per domain.`);
    gaps.push(`- Upsert conflict on dedupe_key; batch writes; record run_id + token usage.`);
    await fs.writeFile("GAPS_FIXLIST.md", gaps.join("\n"));
}
export default async function runAudit() {
    const files = [];
    for (const base of SCAN_DIRS) {
        const dir = join(ROOT, base);
        try {
            await fs.stat(dir);
        }
        catch {
            continue;
        }
        for await (const f of walk(dir))
            files.push(f);
    }
    let done = 0;
    const infos = [];
    for (const f of files) {
        infos.push(await scanFile(f));
        done++;
        progress(done, files.length, "Auditing files:");
    }
    const idx = {
        repoRoot: ROOT,
        scannedAt: new Date().toISOString(),
        files: infos.filter(i => Object.values(i.hits).some(arr => (arr?.length ?? 0) > 0)),
        summary: summarize(infos)
    };
    await writeArtifacts(idx);
}
if (process.argv[1]?.endsWith("AuditRunner.mjs")) {
    (async () => { await runAudit(); })().catch(e => { console.error(e); process.exit(1); });
}
