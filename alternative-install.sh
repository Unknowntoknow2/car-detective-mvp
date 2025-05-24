
#!/bin/bash
# Super simplified installation script for environments with limited resources

echo "Starting simplified installation process..."

# Set memory allocation and timeout
export NODE_OPTIONS="--max-old-space-size=4096"
export NPM_CONFIG_NETWORK_TIMEOUT=300000

# Skip Puppeteer download
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install only the most essential packages first
echo "Installing minimal dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --loglevel=error || {
  echo "Minimal install failed. Trying different approach..."
  npm install --no-package-lock --no-fund --prefer-offline --loglevel=error
}

echo "Installation completed."
