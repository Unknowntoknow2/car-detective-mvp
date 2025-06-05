
#!/bin/bash

echo "🔧 Fixing Rollup native binary issue..."

# Set environment variables to prevent native binary loading
export ROLLUP_NATIVE=false
export NODE_OPTIONS="--max-old-space-size=4096"

# Remove problematic cache and lock files
echo "🧹 Cleaning up..."
rm -rf node_modules/.cache
rm -rf node_modules/@rollup
rm -rf ~/.npm/_cacache

# Force npm to ignore optional dependencies and use legacy resolution
echo "📦 Reinstalling dependencies with forced resolution..."
npm install --force --no-optional --legacy-peer-deps

echo "✅ Rollup issue should be resolved. Try running 'npm run dev' now."
