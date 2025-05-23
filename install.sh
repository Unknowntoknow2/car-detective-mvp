
#!/bin/bash
# Enhanced installation script with better timeout handling and fallbacks

echo "Starting enhanced installation process..."

# Set larger Node memory allocation
export NODE_OPTIONS="--max-old-space-size=8192"

# Try NPM install first with longer timeout and fewer dependencies
echo "Attempting NPM install with core dependencies only..."
npm install @supabase/supabase-js react react-dom react-router-dom --no-fund --prefer-offline --loglevel=error || {
  echo "First attempt failed. Trying with basic dependencies and shorter timeout..."
  
  # Second attempt with only critical dependencies
  npm install react react-dom @supabase/supabase-js --no-fund --prefer-offline --loglevel=error || {
    echo "All installation attempts failed. Please check your network connection."
    exit 1
  }
}

echo "Core dependencies installed successfully. Installing remaining packages..."
npm install --no-fund --prefer-offline --loglevel=error

echo "Installation completed successfully."
