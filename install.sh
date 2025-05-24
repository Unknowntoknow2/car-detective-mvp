
#!/bin/bash
# Enhanced installation script with better timeout handling and fallbacks

echo "Starting enhanced installation process..."

# Forcefully set Puppeteer variables
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_DOWNLOAD=1
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

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
legacy-peer-deps=true
EOL

# Remove any existing puppeteer cache to avoid incomplete downloads
echo "Cleaning up any problematic Puppeteer installations..."
rm -rf node_modules/puppeteer
rm -rf node_modules/puppeteer-*
rm -rf ~/.cache/puppeteer
rm -rf ~/.cache/chromium

# Try NPM install first with core dependencies and longer timeout, explicitly exclude puppeteer
echo "Attempting NPM install with core dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --prefer-offline --loglevel=error --timeout=600000 --legacy-peer-deps || {
  echo "First attempt failed. Trying with alternative approach..."
  
  # Try with yarn as fallback
  echo "Attempting yarn installation..."
  if command -v yarn &> /dev/null; then
    yarn install --network-timeout 600000 --ignore-optional || {
      echo "Yarn install failed. Trying final approach with npm..."
      
      # Final attempt with npm
      echo "Final attempt with npm and minimal dependencies..."
      npm install react react-dom --no-package-lock --no-fund --prefer-offline --legacy-peer-deps
    }
  else
    echo "Yarn not available. Using npm with limited concurrency..."
    npm install --no-package-lock --no-fund --prefer-offline --loglevel=error --legacy-peer-deps
  fi
}

echo "Core dependencies installation completed. Installing remaining packages..."
npm install --prefer-offline --no-fund --loglevel=error --legacy-peer-deps

echo "Installation process completed."
