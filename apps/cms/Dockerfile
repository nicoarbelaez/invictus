# Production Dockerfile for Strapi 5 (Dokploy)
# Docs: https://docs.strapi.io/cms/installation/docker
# Critical: do NOT set NODE_ENV=production before installing deps (admin build needs devDependencies).

# ── Build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

RUN apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  vips-dev \
  git \
  python3

WORKDIR /opt/app

COPY package.json ./
COPY package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
  npm config set fetch-retry-maxtimeout 600000 -g \
  && if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY tsconfig.json ./
COPY src ./src
COPY config ./config
COPY public ./public

# Ensure uploads dir exists even if gitignored empty
RUN mkdir -p public/uploads

ENV NODE_ENV=production
RUN npm run build

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN apk add --no-cache vips-dev dumb-init \
  && addgroup -g 1001 -S strapi \
  && adduser -S strapi -u 1001 -G strapi

WORKDIR /opt/app

ENV NODE_ENV=production \
  HOST=0.0.0.0 \
  PORT=1337 \
  IS_PROXIED=true \
  PATH=/opt/app/node_modules/.bin:$PATH

# Full app from build (src + dist/build needed by `strapi start`)
COPY --from=build --chown=strapi:strapi /opt/app ./

RUN npm prune --omit=dev \
  && mkdir -p public/uploads \
  && chown -R strapi:strapi /opt/app

USER strapi

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => { process.exit(r.statusCode === 204 ? 0 : 1) })" || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start"]
