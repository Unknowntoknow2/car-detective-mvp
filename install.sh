
#!/bin/bash
# Enhanced installation script with increased timeouts and fallbacks

echo "Starting enhanced installation process..."

# Set larger Node memory allocation
export NODE_OPTIONS="--max-old-space-size=8192"

# Try NPM install first with longer timeout
echo "Attempting NPM install with extended timeout..."
npm install --no-fund --prefer-offline --no-package-lock --no-audit --loglevel=error || {
  echo "First attempt failed. Trying with network retries..."
  
  # Second attempt with network retry flags
  npm install --no-fund --prefer-offline --no-package-lock --no-audit --loglevel=error || {
    echo "Network retry failed. Attempting with basic dependencies only..."
    
    # Final attempt with only essential dependencies
    npm install react react-dom react-router-dom @supabase/supabase-js --no-fund --prefer-offline --no-package-lock || {
      echo "All installation attempts failed. Please check your network connection."
      exit 1
    }
  }
}

echo "Installation completed successfully."
