
#!/bin/bash
# Alternative installation script that tries multiple package managers

echo "Starting alternative installation process..."

# Try NPM first
if command -v npm &> /dev/null; then
  echo "Attempting installation with npm..."
  npm install --prefer-offline --no-audit --no-fund || FAILED_NPM=true
  if [ -z "$FAILED_NPM" ]; then
    echo "NPM installation successful!"
    exit 0
  fi
fi

# Try PNPM as alternative
if command -v pnpm &> /dev/null; then
  echo "Attempting installation with pnpm..."
  pnpm install --prefer-offline --no-strict-peer-dependencies || FAILED_PNPM=true
  if [ -z "$FAILED_PNPM" ]; then
    echo "PNPM installation successful!"
    exit 0
  fi
fi

# Try Yarn as last resort
if command -v yarn &> /dev/null; then
  echo "Attempting installation with yarn..."
  yarn install --offline --prefer-offline --network-timeout 600000 && {
    echo "Yarn installation successful!"
    exit 0
  }
fi

echo "All installation attempts failed. Please try manually installing the dependencies."
exit 1
