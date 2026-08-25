import type { Core } from '@strapi/strapi'

/**
 * Browser origins allowed to call the Strapi API.
 * SSG on Vercel fetches CMS server-side (no CORS), but admin plugins,
 * previews, and future client calls need these origins.
 *
 * Override with CORS_ORIGIN (comma-separated) in Dokploy / .env.
 *
 * Live (DNS OK):
 * - Storefront: https://invictusjoyas.vercel.app
 * - Local: localhost:4321
 *
 * Draft (no zone / NXDOMAIN yet — add via CORS_ORIGIN when ready):
 * - https://invictusjoyas.com
 * - https://www.invictusjoyas.com
 */
const defaultCorsOrigins = [
  'http://localhost:4321',
  'http://127.0.0.1:4321',
  'https://invictusjoyas.vercel.app',
]

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com'],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGIN', defaultCorsOrigins),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
      ],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  {
    name: 'strapi::favicon',
    config: {
      path: './public/favicon.ico',
    },
  },
  'strapi::public',
]

export default config
