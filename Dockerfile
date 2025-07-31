# # Use official Node.js runtime as base image
# FROM node:18-alpine AS build

# # Set working directory in container
# WORKDIR /app

# # Copy package.json and package-lock.json (if available)
# COPY package*.json ./

# # Install all dependencies (build needs devDependencies)

# # Accept build arguments
# ARG VITE_API_BASE_URL


# # Set environment variables from build args
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# # Install dependencies
# RUN npm ci

# # Copy source code
# COPY . .

# # Build the React app for production
# RUN npm run build

# # Production stage - use nginx to serve static files
# FROM nginx:alpine AS production

# # Remove default nginx static assets
# RUN rm -rf /usr/share/nginx/html/*

# # Copy built app from build stage to nginx html directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy custom nginx configuration for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost/ || exit 1

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]

# Use official Node.js runtime as base image
FROM node:18-alpine AS build

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# # Set hardcoded environment variable
# ENV VITE_API_BASE_URL=http://192.168.6.154:5268/api

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app for production
RUN npm run build

# Production stage - use nginx to serve static files
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from build stage to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
