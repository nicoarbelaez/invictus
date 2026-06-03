FROM node:20-alpine

RUN apk add --no-cache libc6-compat dumb-init

# Non-root user for security
RUN addgroup -g 1001 -S strapi && adduser -S strapi -u 1001 -G strapi

WORKDIR /app

# Install dependencies
COPY --chown=strapi:strapi package.json ./
RUN npm install

# Copy source files (required: strapi start runs tsc at boot to resolve distDir)
COPY --chown=strapi:strapi tsconfig.json ./
COPY --chown=strapi:strapi src ./src
COPY --chown=strapi:strapi config ./config
COPY --chown=strapi:strapi database ./database
COPY --chown=strapi:strapi public ./public

# Build admin panel + compile TypeScript
RUN NODE_ENV=production npm run build

# Fix uploads dir permissions
RUN mkdir -p public/uploads && chown -R strapi:strapi public/uploads

USER strapi

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => { process.exit(r.statusCode === 204 ? 0 : 1) })" || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start"]
