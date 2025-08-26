import fs from "fs";
import path from "path";
export function loadSourceRegistry() {
    const file = path.resolve(__dirname, "./sources.master.json");
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw);
    // Optionally: validate structure here
    return parsed;
}
