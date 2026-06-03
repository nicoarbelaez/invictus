import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
export default defineConfig({
  env: {
    schema: {
      CMS_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),

      CMS_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),

      NODE_ENV: envField.enum({
        context: 'server',
        access: 'public',
        values: ['development', 'production'],
        default: 'development',
      }),
    },

    validateSecrets: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://invictusjoyas.com',
  integrations: [sitemap(), react(), mdx()],
})
