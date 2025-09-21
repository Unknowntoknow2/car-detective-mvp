
import { populateMsrpsFromWebSearch } from './populateMsrpFromWeb';

// CLI runner for the MSRP population script
async function main() {
  try {
    await populateMsrpsFromWebSearch();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}
