import type { StrapiApp } from '@strapi/strapi/admin'

const ADMIN_LANGUAGE_KEY = 'strapi-admin-language'
/** Admin UI language packs (Content Manager locales are separate: es default + en). */
const ADMIN_LOCALES = ['es', 'en'] as const
const DEFAULT_ADMIN_LOCALE = 'es'

export default {
  config: {
    locales: [...ADMIN_LOCALES],
    // Fix broken Strapi i18n Spanish string (missing space before <bold>)
    // @see https://docs.strapi.io/cms/admin-panel-customization/locales-translations
    translations: {
      es: {
        'i18n.CMEditViewLocalePicker.locale.create':
          'Crear localización <bold>{locale}</bold>',
      },
    },
  },
  bootstrap(_app: StrapiApp) {
    // Prefer Spanish admin UI on first visit
    try {
      if (localStorage.getItem(ADMIN_LANGUAGE_KEY)) return
      localStorage.setItem(ADMIN_LANGUAGE_KEY, DEFAULT_ADMIN_LOCALE)
      window.location.reload()
    } catch {
      // localStorage may be unavailable in restricted browsers
    }
  },
}
