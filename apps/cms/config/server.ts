import type { Core } from '@strapi/strapi'

/**
 * PUBLIC_URL = absolute URL of this Strapi instance (scheme + host, no trailing slash).
 * Required behind Traefik/Dokploy so admin assets and absolute links resolve correctly.
 *
 * Live:  https://cmsinvictusjoyas.arbelaeznicolas.dev (Cloudflare zone arbelaeznicolas.dev)
 * Draft: https://cms.invictusjoyas.com (zone/DNS not created yet)
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  proxy: env.bool('IS_PROXIED', true),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Built-in MCP for content CRUD via AI clients (Cursor / Claude Code).
  // Docs: https://docs.strapi.io/cms/features/strapi-mcp-server
  mcp: {
    enabled: env.bool('STRAPI_MCP_ENABLED', true),
  },
})

export default config
