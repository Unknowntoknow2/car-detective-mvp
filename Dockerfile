
# Step 1: Use official Node image with improved settings for package installation
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Copy our enhanced config files
COPY .npmrc ./
COPY install.sh ./
RUN chmod +x ./install.sh

# Set environment variables to increase memory and timeout limits
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NPM_CONFIG_NETWORK_TIMEOUT=600000

# Install dependencies with retries and increased timeout
RUN apk add --no-cache bash && \
    ./install.sh || npm install --no-fund --prefer-offline

# Copy the rest of the project files
COPY . .

# Build the app with more memory allowance
RUN npm run build

# Step 2: Serve the built app using a lightweight web server
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX config (if any), fallback to default
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d

# Expose port 80 and start NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
