import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
export default defineConfig({
  // Full SSG: HTML is generated at build time. CMS publish → rebuild (no runtime fetch).
  output: 'static',
  env: {
    schema: {
      // Build-time only (astro:env/server). Never shipped to the browser.
      CMS_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // Read-only Content API token (Strapi → Settings → API Tokens). Required for builds.
      CMS_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        min: 1,
      }),
    },

    // Fail fast at `astro dev` / `astro build` if CMS_URL or CMS_TOKEN are missing.
    validateSecrets: true,
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
