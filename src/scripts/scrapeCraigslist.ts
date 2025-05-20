// ✅ File: src/scripts/scrapeCraigslist.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fetchCraigslistListings } from '../utils/scrapers/craigslist';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const listings = await fetchCraigslistListings('Toyota', 'Camry', '95814', 5);

  const htmlPath = path.resolve(__dirname, '../../debug/craigslist.html');
  fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
  fs.writeFileSync(htmlPath, (globalThis as any).__DEBUG_HTML__ || '');

  console.log(`📄 Debug HTML saved to: ${htmlPath}`);
  console.log('✅ Craigslist Listings:', listings);
})();
