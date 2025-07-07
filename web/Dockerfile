# Multi-stage build for NextJS Web Application
FROM node:24.3.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy NX configuration and workspace files
COPY web/project.json ./web/
COPY shared-types/project.json ./shared-types/
COPY trpc-config/project.json ./trpc-config/

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production=false

# Copy source code for all packages
COPY web/ ./web/
COPY shared-types/ ./shared-types/
COPY trpc-config/ ./trpc-config/

# Build the shared packages first
RUN npx nx build shared-types
RUN npx nx build trpc-config

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the NextJS application
RUN npx nx build web

# Production stage
FROM node:24.3.0-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package.json for runtime dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built NextJS application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dist/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/dist/web/public ./web/public

# Create directory for logs with proper permissions
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "web/server.js"]
