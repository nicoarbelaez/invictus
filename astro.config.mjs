import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://invictusjoyas.com',
  integrations: [sitemap(), react(), mdx()],
})
