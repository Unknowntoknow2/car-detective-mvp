
#!/usr/bin/env node

/**
 * This script removes any traces of Puppeteer from the project
 * Run with: node src/scripts/cleanPuppeteer.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


// Set environment variables
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
process.env.SKIP_PUPPETEER_DOWNLOAD = 'true';

// Directories to check
const dirs = [
  'node_modules/puppeteer',
  'node_modules/puppeteer-core',
  'node_modules/.cache/puppeteer',
  'node_modules/playwright',
  'node_modules/playwright-core',
  'node_modules/.cache/playwright',
  path.join(require('os').homedir(), '.cache/puppeteer'),
  path.join(require('os').homedir(), '.cache/chromium'),
  path.join(require('os').homedir(), '.cache/playwright')
];

// Remove directories
dirs.forEach(dir => {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error(`Error removing ${dir}:`, err);
  }
});

// Create blocking .puppeteerrc.js
const puppeteerRcContent = `
module.exports = {
  skipDownload: true,
  skipChromiumDownload: true,
  cacheDirectory: '/dev/null',
  executablePath: '/bin/false',
  browserRevision: 'none',
  product: 'none',
  logLevel: 'silent'
};
`;

fs.writeFileSync('.puppeteerrc.js', puppeteerRcContent);

