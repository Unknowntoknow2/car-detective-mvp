
#!/bin/bash
# Enhanced installation script with aggressive Puppeteer prevention

echo "Starting enhanced installation process..."

# Forcefully set Puppeteer variables with all possible variations
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_DOWNLOAD=1
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
export SKIP_PUPPETEER_DOWNLOAD=true
export PUPPETEER_NO_DOWNLOAD=true
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true
export PLAYWRIGHT_BROWSERS_PATH=/dev/null
export PUPPETEER_EXECUTABLE_PATH=/bin/false
export CHROME_BIN=/bin/false
export CHROMIUM_BIN=/bin/false
export PUPPETEER_CACHE_DIR=/dev/null

# Set larger Node memory allocation
export NODE_OPTIONS="--max-old-space-size=8192"

# Create a faster .npmrc configuration
cat > .npmrc << EOL
fetch-timeout=600000
fetch-retry-mintimeout=60000
fetch-retry-maxtimeout=300000
fetch-retries=10
network-timeout=600000
prefer-offline=true
fund=false
audit=false
loglevel=error
node-options=--max-old-space-size=8192
puppeteer_skip_download=true
puppeteer_skip_chromium_download=true
puppeteer_skip_download=1
puppeteer_skip_chromium_download=1
PUPPETEER_SKIP_DOWNLOAD=true
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_SKIP_DOWNLOAD=1
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
PUPPETEER_NO_DOWNLOAD=true
playwright_skip_browser_download=true
ignore-scripts=true
legacy-peer-deps=true
EOL

# Create a .puppeteerrc.js in every location it might be checked
echo "Blocking Puppeteer in all possible locations..."
echo "export default { skipDownload: true, skipChromiumDownload: true };" > .puppeteerrc.js
mkdir -p ~/.cache && echo "export default { skipDownload: true, skipChromiumDownload: true };" > ~/.cache/.puppeteerrc.js
mkdir -p ~/.puppeteer && echo "export default { skipDownload: true, skipChromiumDownload: true };" > ~/.puppeteer/.puppeteerrc.js

# Remove any existing puppeteer cache to avoid incomplete downloads
echo "Cleaning up any problematic Puppeteer installations..."
rm -rf node_modules/puppeteer
rm -rf node_modules/puppeteer-*
rm -rf node_modules/playwright*
rm -rf ~/.cache/puppeteer
rm -rf ~/.cache/chromium
rm -rf ~/.cache/ms-playwright
rm -rf ~/.cache/playwright

# Try NPM install first with core dependencies and longer timeout, explicitly exclude puppeteer
echo "Attempting NPM install with core dependencies and ignore-scripts..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --prefer-offline --loglevel=error --timeout=600000 --legacy-peer-deps --ignore-scripts || {
  echo "First attempt failed. Trying with alternative approach..."
  
  # Try with yarn as fallback
  echo "Attempting yarn installation with ignore-scripts..."
  if command -v yarn &> /dev/null; then
    yarn install --network-timeout 600000 --ignore-optional --ignore-scripts || {
      echo "Yarn install failed. Trying final approach with npm..."
      
      # Final attempt with npm
      echo "Final attempt with npm and minimal dependencies..."
      npm install react react-dom --no-package-lock --no-fund --prefer-offline --legacy-peer-deps --ignore-scripts
    }
  else
    echo "Yarn not available. Using npm with limited concurrency..."
    npm install --no-package-lock --no-fund --prefer-offline --loglevel=error --legacy-peer-deps --ignore-scripts
  fi
}

echo "Core dependencies installation completed. Installing remaining packages..."
npm install --prefer-offline --no-fund --loglevel=error --legacy-peer-deps --ignore-scripts

echo "Installation process completed."
