
#!/bin/bash
# Enhanced installation script with better timeout handling and fallbacks

echo "Starting enhanced installation process..."

# Set larger Node memory allocation
export NODE_OPTIONS="--max-old-space-size=8192"

# Set environment variables to skip Puppeteer download
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

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
PUPPETEER_SKIP_DOWNLOAD=true
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
EOL

# Try NPM install first with core dependencies and longer timeout
echo "Attempting NPM install with core dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --prefer-offline --loglevel=error --timeout=600000 || {
  echo "First attempt failed. Trying with alternative approach..."
  
  # Try with yarn as fallback
  echo "Attempting yarn installation..."
  if command -v yarn &> /dev/null; then
    yarn install --network-timeout 600000 || {
      echo "Yarn install failed. Trying final approach with npm..."
      
      # Final attempt with npm
      echo "Final attempt with npm and minimal dependencies..."
      npm install react react-dom --no-package-lock --no-fund --prefer-offline
    }
  else
    echo "Yarn not available. Using npm with limited concurrency..."
    npm install --no-package-lock --no-fund --prefer-offline --loglevel=error
  fi
}

echo "Core dependencies installation completed. Installing remaining packages..."
npm install --prefer-offline --no-fund --loglevel=error

echo "Installation process completed."
