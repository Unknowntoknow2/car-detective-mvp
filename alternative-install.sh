
#!/bin/bash
# Alternative installation script with simplified approach

echo "Starting alternative installation process..."

# Set memory and timeout options
export NODE_OPTIONS="--max-old-space-size=8192"
export NPM_CONFIG_NETWORK_TIMEOUT=600000

# Install only core dependencies first to reduce initial load
echo "Installing core dependencies..."
npm install react react-dom @supabase/supabase-js --no-fund --no-audit --loglevel=error

echo "Core dependencies installed. Installing remaining packages..."
npm install --no-fund --no-audit --prefer-offline --loglevel=error

echo "Installation completed."
