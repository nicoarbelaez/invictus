import type { Core } from '@strapi/strapi'

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  // Disabled as Strapi plugin under pnpm: resolve.exports / pathToPlugin break
  // develop ("not installed"). Types come from `pnpm cms:types` (strapi ts:generate-types
  // + scripts/generate-cms-types.js). Keep the npm package for CLI if needed.
  'strapi-typed-client': {
    enabled: false,
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {
          folder: 'invictusjoyas',
        },
        delete: {},
      },
    },
  },
})

export default config
