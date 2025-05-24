
# Step 1: Use official Node image with improved settings for package installation
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Set environment variables to skip Puppeteer downloads
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

# Copy package files first (for better layer caching)
COPY package*.json ./
COPY .npmrc ./
COPY .puppeteerrc.js ./

# Set environment variables to increase memory and timeout limits
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NPM_CONFIG_NETWORK_TIMEOUT=600000

# Remove problematic puppeteer cache if it exists
RUN rm -rf ~/.cache/puppeteer || true
RUN mkdir -p ~/.cache && touch ~/.cache/.puppeteerrc.js && echo "export default { skipDownload: true };" > ~/.cache/.puppeteerrc.js

# Install dependencies with retries and increased timeout
RUN npm install --no-fund --prefer-offline --loglevel=error || \
    npm install --no-fund --prefer-offline --loglevel=error || \
    (apk add --no-cache curl && npm cache clean --force && npm install --no-fund --prefer-offline)

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
