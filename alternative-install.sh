
#!/bin/bash
# Super aggressive simplified installation script for environments with problematic Puppeteer

echo "Starting aggressive installation process to prevent Puppeteer..."

# Force all environment variables to prevent Puppeteer download
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_DOWNLOAD=1
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
export SKIP_PUPPETEER_DOWNLOAD=true
export PUPPETEER_SKIP_CHROME_DOWNLOAD=true
export PUPPETEER_NO_DOWNLOAD=true
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true
export PLAYWRIGHT_BROWSERS_PATH=/dev/null
export PUPPETEER_EXECUTABLE_PATH=/bin/false
export CHROME_BIN=/bin/false
export CHROMIUM_BIN=/bin/false
export PUPPETEER_CACHE_DIR=/dev/null

# Set memory allocation and timeout
export NODE_OPTIONS="--max-old-space-size=4096"
export NPM_CONFIG_NETWORK_TIMEOUT=300000

# Remove any existing puppeteer cache to avoid incomplete downloads
echo "Cleaning up any problematic Puppeteer installations..."
rm -rf node_modules/puppeteer
rm -rf node_modules/puppeteer-*
rm -rf node_modules/playwright*
rm -rf ~/.cache/puppeteer
rm -rf ~/.cache/chromium
rm -rf ~/.cache/ms-playwright
rm -rf ~/.cache/playwright

# Create empty puppeteer config to prevent downloads
mkdir -p ~/.cache
echo "export default { skipDownload: true, skipChromiumDownload: true, cacheDirectory: '/dev/null' };" > ~/.cache/.puppeteerrc.js

# Create a file to override the puppeteer's getConfiguration.js
mkdir -p ~/.cache/puppeteer-override
echo "export function getConfiguration() { return Object.freeze({ skipDownload: true }); }" > ~/.cache/puppeteer-override/getConfiguration.js

# Create and use an .npmrc file that ignores scripts
echo "ignore-scripts=true" > .npmrc
echo "puppeteer_skip_download=true" >> .npmrc
echo "puppeteer_skip_chromium_download=true" >> .npmrc

# Install only the most essential packages first
echo "Installing minimal dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --loglevel=error --legacy-peer-deps --ignore-scripts || {
  echo "Minimal install failed. Trying different approach..."
  npm install --no-package-lock --no-fund --prefer-offline --loglevel=error --legacy-peer-deps --ignore-scripts
}

echo "Installation completed."
