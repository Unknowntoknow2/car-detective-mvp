
#!/bin/bash
# Super simplified installation script for environments with limited resources

echo "Starting simplified installation process..."

# Set environment variables to skip Puppeteer download
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_DOWNLOAD=1
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
export SKIP_PUPPETEER_DOWNLOAD=true
export PUPPETEER_SKIP_CHROME_DOWNLOAD=true

# Set memory allocation and timeout
export NODE_OPTIONS="--max-old-space-size=4096"
export NPM_CONFIG_NETWORK_TIMEOUT=300000

# Remove any existing puppeteer cache to avoid incomplete downloads
echo "Cleaning up any problematic Puppeteer installations..."
rm -rf node_modules/puppeteer
rm -rf node_modules/puppeteer-*
rm -rf ~/.cache/puppeteer
rm -rf ~/.cache/chromium

# Create empty puppeteer config to prevent downloads
mkdir -p ~/.cache
echo "export default { skipDownload: true, skipChromiumDownload: true, cacheDirectory: '/dev/null' };" > ~/.cache/.puppeteerrc.js

# Install only the most essential packages first
echo "Installing minimal dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --loglevel=error --legacy-peer-deps || {
  echo "Minimal install failed. Trying different approach..."
  npm install --no-package-lock --no-fund --prefer-offline --loglevel=error --legacy-peer-deps
}

echo "Installation completed."
