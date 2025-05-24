
# Step 1: Use official Node image with improved settings for package installation
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Set ALL environment variables to skip Puppeteer downloads
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
    SKIP_PUPPETEER_DOWNLOAD=true \
    PUPPETEER_NO_DOWNLOAD=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true \
    PLAYWRIGHT_BROWSERS_PATH=/dev/null \
    PUPPETEER_EXECUTABLE_PATH=/bin/false \
    CHROME_BIN=/bin/false \
    CHROMIUM_BIN=/bin/false \
    PUPPETEER_CACHE_DIR=/dev/null \
    NPM_CONFIG_IGNORE_SCRIPTS=true

# Copy package files first (for better layer caching)
COPY package*.json ./
COPY .npmrc ./
COPY .puppeteerrc.js ./
COPY .npmignore ./

# Set environment variables to increase memory and timeout limits
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NPM_CONFIG_NETWORK_TIMEOUT=600000
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

# Pre-create required directories to ensure they exist
RUN mkdir -p /root/.cache
RUN mkdir -p /root/.npm

# Remove problematic puppeteer cache if it exists
RUN rm -rf /root/.cache/puppeteer || true
RUN rm -rf /root/.cache/chromium || true
RUN mkdir -p /root/.cache && touch /root/.cache/.puppeteerrc.js && echo "export default { skipDownload: true, skipChromiumDownload: true, cacheDirectory: '/dev/null' };" > /root/.cache/.puppeteerrc.js

# Install dependencies with retries and increased timeout
RUN echo "ignore-scripts=true" >> .npmrc && \
    npm install --no-fund --prefer-offline --loglevel=error --legacy-peer-deps --ignore-scripts || \
    npm install --no-fund --prefer-offline --loglevel=error --legacy-peer-deps --ignore-scripts || \
    (apk add --no-cache curl && npm cache clean --force && npm install --no-fund --prefer-offline --legacy-peer-deps --ignore-scripts)

# Copy the rest of the project files
COPY . .

# Build the app with more memory allowance
RUN npm run build

# Step 2: Serve the built app using a lightweight web server
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 and start NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
