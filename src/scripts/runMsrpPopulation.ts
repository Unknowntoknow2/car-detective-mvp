
import { populateMsrpsFromWebSearch } from './populateMsrpFromWeb';

// CLI runner for the MSRP population script
async function main() {
  try {
    console.log('🚀 Starting MSRP population process...');
    await populateMsrpsFromWebSearch();
    console.log('✅ Process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Process failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}
