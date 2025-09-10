import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import readline from "readline";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const file = args.file || "data/zip_centroids.sample.csv";
const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_ANON_KEY!;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}
const supabase = createClient(url, key);

async function main() {
  if (!fs.existsSync(file)) {
    console.error(`CSV not found: ${file}`);
    process.exit(1);
  }
  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  let i = 0, ok = 0, fail = 0;
  const batch: any[] = [];
  for await (const line of rl) {
    i++;
    if (i === 1) continue; // header
    if (!line.trim()) continue;
    const [zip, lat, lon] = line.split(",");
    if (!zip || !lat || !lon) { fail++; continue; }
    batch.push({ zip: zip.trim(), lat: Number(lat), lon: Number(lon) });
    if (batch.length >= 1000) {
      const { error } = await supabase.from("zip_centroids").upsert(batch, { onConflict: "zip" });
      if (error) { console.error(error.message); fail += batch.length; } else { ok += batch.length; }
      batch.length = 0;
    }
  }
  if (batch.length) {
    const { error } = await supabase.from("zip_centroids").upsert(batch, { onConflict: "zip" });
    if (error) { console.error(error.message); fail += batch.length; } else { ok += batch.length; }
  }
  console.log(JSON.stringify({ file, processed: i-1, upserted: ok, failed: fail }, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); });
