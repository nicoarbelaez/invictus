/**
 * Deduplicate **within a single `astro build`** only (one Node process, many routes).
 *
 * This is NOT a production runtime cache:
 * - SSG has no live CMS calls after deploy; HTML is baked at build.
 * - Products, carousel slides, announcement bar, etc. update via **rebuild on publish**.
 * - Use this only for data shared by many pages in one build (e.g. Global branding).
 * - Do NOT wrap per-product fetches — each product page needs its own data.
 *
 * In `astro dev`, always runs `fn` so CMS edits show on refresh.
 */
const stores = new Map<string, Promise<unknown>>()

export function oncePerBuild<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (import.meta.env.DEV) {
    return fn()
  }
  const existing = stores.get(key)
  if (existing) {
    return existing as Promise<T>
  }
  const pending = fn()
  stores.set(key, pending)
  return pending
}
