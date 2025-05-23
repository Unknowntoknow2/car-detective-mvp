
#!/bin/bash
# Enhanced installation script with better timeout handling and fallbacks

echo "Starting enhanced installation process..."

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
EOL

# Try NPM install first with core dependencies and longer timeout
echo "Attempting NPM install with core dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --prefer-offline --loglevel=error --timeout=600000 || {
  echo "First attempt failed. Trying with alternative approach..."
  
  # Try with yarn as fallback
  echo "Attempting yarn installation..."
  if command -v yarn &> /dev/null; then
    yarn install --network-timeout 600000 || {
      echo "Yarn install failed. Trying bun install with limited concurrency..."
      
      # Try bun with limited concurrency if available
      if command -v bun &> /dev/null; then
        echo "Using bun for installation with limited concurrency..."
        # Setting BUN_INSTALL_CACHE_DIR to a known location might help with permissions
        export BUN_INSTALL_CACHE_DIR="./node_modules/.cache/bun"
        mkdir -p $BUN_INSTALL_CACHE_DIR
        
        # Use --no-save to avoid lockfile issues
        bun install --no-save
      else
        echo "Bun not available. Final attempt with npm and minimal dependencies..."
        npm install react react-dom --no-package-lock --no-fund --prefer-offline
      fi
    }
  else
    echo "Yarn not available. Using npm with limited concurrency..."
    npm install --no-package-lock --no-fund --prefer-offline --loglevel=error
  fi
}

echo "Core dependencies installation completed. Installing remaining packages..."
npm install --prefer-offline --no-fund --loglevel=error

echo "Installation process completed."
