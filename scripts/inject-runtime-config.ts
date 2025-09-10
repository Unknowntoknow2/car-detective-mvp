/**
 * Runtime configuration injection script
 * 
 * This script replaces the __APP_CONFIG__ placeholder in index.html
 * with actual configuration values from environment variables.
 */

import fs from 'fs';
import path from 'path';

interface RuntimeConfig {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  VEHICLE_API_URL?: string;
  FEATURE_AUDIT?: string;
  SENTRY_DSN?: string;
  MODE?: string;
}

function injectRuntimeConfig(htmlPath: string, outputPath?: string) {
  // Read the HTML file
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  // Build runtime config from environment
  const runtimeConfig: RuntimeConfig = {
    SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VEHICLE_API_URL: process.env.VITE_VEHICLE_API_URL,
    FEATURE_AUDIT: process.env.VITE_FEATURE_AUDIT,
    MODE: process.env.NODE_ENV || 'production',
    // Note: SENTRY_DSN should only be included if needed for client-side
  };
  
  // Filter out undefined values and secrets that shouldn't be in client
  const clientConfig = Object.fromEntries(
    Object.entries(runtimeConfig).filter(([_, value]) => value !== undefined)
  );
  
  // Create the config script
  const configScript = `
<script id="__APP_CONFIG__">
  window.__APP_CONFIG__ = ${JSON.stringify(clientConfig, null, 2)};
</script>`;
  
  // Replace the placeholder
  const updatedHtml = htmlContent.replace(
    /<script id="__APP_CONFIG__">[\s\S]*?<\/script>/,
    configScript
  );
  
  // Write to output path
  const finalOutputPath = outputPath || htmlPath;
  fs.writeFileSync(finalOutputPath, updatedHtml);
  
  console.log(`✅ Runtime config injected into ${finalOutputPath}`);
  console.log(`📝 Config keys: ${Object.keys(clientConfig).join(', ')}`);
}

// CLI usage
if (require.main === module) {
  const htmlPath = process.argv[2] || 'dist/index.html';
  const outputPath = process.argv[3];
  
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML file not found: ${htmlPath}`);
    process.exit(1);
  }
  
  injectRuntimeConfig(htmlPath, outputPath);
}

export { injectRuntimeConfig };