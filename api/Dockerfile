# Multi-stage build for NestJS API
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy NX configuration and workspace files
COPY api/project.json ./api/
COPY shared-types/project.json ./shared-types/
COPY trpc-config/project.json ./trpc-config/

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production=false

# Copy source code for all packages
COPY api/ ./api/
COPY shared-types/ ./shared-types/
COPY trpc-config/ ./trpc-config/

# Build the shared packages first
RUN npx nx build shared-types
RUN npx nx build trpc-config

# Build the API application
RUN npx nx build api

# Production stage
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy any additional runtime files if needed
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Create directory for logs with proper permissions
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app/logs

# Switch to non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node dist/api/main.js --health-check || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
CMD ["node", "dist/api/main.js"]
