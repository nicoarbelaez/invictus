import type { StrapiApp } from '@strapi/strapi/admin'

const ADMIN_LANGUAGE_KEY = 'strapi-admin-language'
const DEFAULT_ADMIN_LOCALE = 'es'

export default {
  config: {
    locales: [DEFAULT_ADMIN_LOCALE],
  },
  bootstrap(_app: StrapiApp) {
    // Strapi defaults the admin UI to English on first visit; prefer Spanish for this project.
    try {
      if (localStorage.getItem(ADMIN_LANGUAGE_KEY)) return
      localStorage.setItem(ADMIN_LANGUAGE_KEY, DEFAULT_ADMIN_LOCALE)
      window.location.reload()
    } catch {
      // localStorage may be unavailable in restricted browsers
    }
  },
}
