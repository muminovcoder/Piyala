# =============================================
# VOCABMASTER AI — PRODUCTION DOCKERFILE
# =============================================
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies (package-lock.json required for npm ci)
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# ===== Production Image =====
FROM node:20-alpine

RUN apk add --no-cache wget ca-certificates

WORKDIR /app

# Copy server dependencies
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/package.json

# Copy server source
COPY server/ ./server/

# Copy frontend files
COPY *.html *.js *.css ./

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "server/server.js"]
