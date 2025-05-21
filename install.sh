
#!/bin/bash
# Alternative installation script with increased timeouts
export NODE_OPTIONS="--max-old-space-size=4096"
npm install --no-fund --prefer-offline
