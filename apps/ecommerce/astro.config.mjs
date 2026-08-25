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
        optional: true,
        default: '',
      }),
    },

    validateSecrets: false,
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand'],
    },
    build: {
      cssMinify: true,
      sourcemap: false,
      target: 'es2022',
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Live host. Draft later: https://invictusjoyas.com
  site: 'https://invictusjoyas.vercel.app',
  integrations: [sitemap(), react(), mdx()],
})
