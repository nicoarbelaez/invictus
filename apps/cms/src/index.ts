import type { Core } from '@strapi/strapi'

/** Default content locale for Invictus (storefront + admin Content Manager). */
const DEFAULT_CONTENT_LOCALE = {
  code: 'es',
  name: 'Español (es)',
} as const

/** Secondary locale for future EN translations (not the default). */
const ENGLISH_LOCALE = {
  code: 'en',
  name: 'English (en)',
} as const

const LOCALIZED_CONTENT_UIDS = [
  'api::producto.producto',
  'api::categoria.categoria',
  'api::global.global',
] as const

/**
 * Ensure content locales: Spanish default + English available.
 * STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE only seeds the first locale on empty DB;
 * this bootstrap keeps es as default even if en was created first.
 * @see https://docs.strapi.io/cms/features/internationalization
 */
async function ensureContentLocales(strapi: Core.Strapi): Promise<void> {
  const locales = strapi.plugin('i18n')?.service('locales')
  if (!locales) return

  const ensureLocale = async (locale: { code: string; name: string }) => {
    const existing = await locales.findByCode(locale.code)
    if (!existing) {
      await locales.create(locale)
      strapi.log.info(`[i18n] Created locale ${locale.code} (${locale.name})`)
      return
    }
    if (existing.name !== locale.name) {
      await locales.update({ id: existing.id }, { name: locale.name })
      strapi.log.info(`[i18n] Renamed locale ${locale.code} → ${locale.name}`)
    }
  }

  await ensureLocale(DEFAULT_CONTENT_LOCALE)
  await ensureLocale(ENGLISH_LOCALE)

  const currentDefault = await locales.getDefaultLocale()
  if (currentDefault !== DEFAULT_CONTENT_LOCALE.code) {
    await locales.setDefaultLocale({ code: DEFAULT_CONTENT_LOCALE.code })
    strapi.log.info(`[i18n] Default content locale set to ${DEFAULT_CONTENT_LOCALE.code}`)
  }
}

/**
 * Move entries created under `en` (old default) to `es` when no Spanish row exists yet.
 * Safe to re-run: skips documentIds that already have an `es` locale.
 */
async function migrateEntriesFromEnToEs(strapi: Core.Strapi): Promise<void> {
  for (const uid of LOCALIZED_CONTENT_UIDS) {
    const enRows = await strapi.db.query(uid).findMany({
      where: { locale: ENGLISH_LOCALE.code },
      select: ['id', 'documentId'],
    })

    if (enRows.length === 0) continue

    let moved = 0
    for (const row of enRows) {
      const hasEs = await strapi.db.query(uid).findOne({
        where: {
          documentId: row.documentId,
          locale: DEFAULT_CONTENT_LOCALE.code,
        },
        select: ['id'],
      })
      if (hasEs) continue

      await strapi.db.query(uid).update({
        where: { id: row.id },
        data: { locale: DEFAULT_CONTENT_LOCALE.code },
      })
      moved += 1
    }

    if (moved > 0) {
      strapi.log.info(`[i18n] Migrated ${moved} ${uid} row(s) from en → es`)
    }
  }
}

/**
 * After migrating to `es`, ensure an `en` localization exists with the same Spanish
 * localized fields (placeholder until real EN translations are written).
 * Safe to re-run.
 * @see https://docs.strapi.io/cms/api/document-service/locale
 */
async function syncSpanishContentToEsAndEn(strapi: Core.Strapi): Promise<void> {
  await migrateEntriesFromEnToEs(strapi)

  const asString = (value: unknown): string | undefined =>
    typeof value === 'string' ? value : undefined

  // Separate loops keep Document Service `data` typed per UID (union breaks TS).
  {
    const uid = 'api::categoria.categoria' as const
    const drafts = await strapi.documents(uid).findMany({
      locale: DEFAULT_CONTENT_LOCALE.code,
      status: 'draft',
      limit: 500,
    })

    let synced = 0
    for (const doc of drafts) {
      const Label = asString(doc.Label)
      const Slug = asString(doc.Slug)
      if (!Label || !Slug) continue

      await strapi.documents(uid).update({
        documentId: doc.documentId,
        locale: ENGLISH_LOCALE.code,
        data: { Label, Slug },
      })

      const published = await strapi.documents(uid).findOne({
        documentId: doc.documentId,
        locale: DEFAULT_CONTENT_LOCALE.code,
        status: 'published',
      })
      if (published) {
        await strapi.documents(uid).publish({
          documentId: doc.documentId,
          locale: ENGLISH_LOCALE.code,
        })
      }
      synced += 1
    }

    if (synced > 0) {
      strapi.log.info(`[i18n] Synced Spanish text to en for ${synced} ${uid} document(s)`)
    }
  }

  {
    const uid = 'api::producto.producto' as const
    const drafts = await strapi.documents(uid).findMany({
      locale: DEFAULT_CONTENT_LOCALE.code,
      status: 'draft',
      limit: 500,
    })

    let synced = 0
    for (const doc of drafts) {
      const Titulo = asString(doc.Titulo)
      const Slug = asString(doc.Slug)
      const Descripcion = asString(doc.Descripcion)
      if (!Titulo || !Slug || !Descripcion) continue

      await strapi.documents(uid).update({
        documentId: doc.documentId,
        locale: ENGLISH_LOCALE.code,
        data: {
          Titulo,
          Slug,
          Descripcion,
          DescripcionCorta: asString(doc.DescripcionCorta),
          Tags: doc.Tags,
        },
      })

      const published = await strapi.documents(uid).findOne({
        documentId: doc.documentId,
        locale: DEFAULT_CONTENT_LOCALE.code,
        status: 'published',
      })
      if (published) {
        await strapi.documents(uid).publish({
          documentId: doc.documentId,
          locale: ENGLISH_LOCALE.code,
        })
      }
      synced += 1
    }

    if (synced > 0) {
      strapi.log.info(`[i18n] Synced Spanish text to en for ${synced} ${uid} document(s)`)
    }
  }
}

// Adjust these UIDs to add/remove which content types trigger a redeploy on publish
const REDEPLOY_TRIGGER_MODELS: string[] = [
  'api::producto.producto',
  'api::categoria.categoria',
  'api::global.global',
]

// ── Deploy providers

type DeployProvider = 'dokploy' | 'vercel'

async function triggerDokployRedeploy(strapi: Core.Strapi): Promise<void> {
  const url = process.env.DOKPLOY_REDEPLOY_URL
  const composeId = process.env.DOKPLOY_COMPOSE_ID
  const title = process.env.DOKPLOY_TITLE
  const description = process.env.DOKPLOY_DESCRIPTION
  const apiKey = process.env.DOKPLOY_API_KEY

  const missing = [
    !url && 'DOKPLOY_REDEPLOY_URL',
    !composeId && 'DOKPLOY_COMPOSE_ID',
    !apiKey && 'DOKPLOY_API_KEY',
  ].filter(Boolean)

  if (missing.length > 0) {
    strapi.log.error(`[dokploy] Missing required env vars: ${missing.join(', ')}`)
    return
  }

  try {
    const res = await fetch(url!, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
      },
      body: JSON.stringify({ composeId, title, description }),
    })

    if (!res.ok) {
      const body = await res.text()
      strapi.log.error(`[dokploy] Redeploy failed — HTTP ${res.status}: ${body}`)
    } else {
      strapi.log.info('[dokploy] Redeploy triggered successfully')
    }
  } catch (err) {
    strapi.log.error(
      `[dokploy] Redeploy request threw: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

async function triggerVercelRedeploy(strapi: Core.Strapi): Promise<void> {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID

  const missing = [!token && 'VERCEL_TOKEN', !projectId && 'VERCEL_PROJECT_ID'].filter(Boolean)

  if (missing.length > 0) {
    strapi.log.error(`[vercel] Missing required env vars: ${missing.join(', ')}`)
    return
  }

  try {
    // Step 1: fetch latest production deployment
    const listRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=production&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      }
    )

    if (!listRes.ok) {
      const body = await listRes.text()
      strapi.log.error(
        `[vercel] Failed to fetch latest deployment — HTTP ${listRes.status}: ${body}`
      )
      return
    }

    const listData = (await listRes.json()) as {
      deployments?: { uid: string; name: string }[]
    }
    const latest = listData.deployments?.[0]
    const deploymentId = latest?.uid
    const projectName = latest?.name

    if (!deploymentId || !projectName) {
      strapi.log.error('[vercel] No production deployments found for the project')
      return
    }

    // Step 2: redeploy using that deployment ID
    const redeployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ deploymentId, name: projectName, target: 'production' }),
    })

    if (!redeployRes.ok) {
      const body = await redeployRes.text()
      strapi.log.error(`[vercel] Redeploy failed — HTTP ${redeployRes.status}: ${body}`)
    } else {
      strapi.log.info(`[vercel] Redeploy triggered (deploymentId: ${deploymentId})`)
    }
  } catch (err) {
    strapi.log.error(
      `[vercel] Redeploy request threw: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

// ── Cooldown — in-memory, resets on server restart
let lastRedeployAt = 0

async function triggerRedeploy(strapi: Core.Strapi): Promise<void> {
  const cooldownMs = parseInt(process.env.DEPLOY_COOLDOWN_MS ?? '60000', 10)
  const now = Date.now()
  const elapsed = now - lastRedeployAt

  if (lastRedeployAt > 0 && elapsed < cooldownMs) {
    const remainingSec = Math.ceil((cooldownMs - elapsed) / 1000)
    strapi.log.info(`[deploy] Cooldown activo — redeploy omitido (faltan ${remainingSec}s)`)
    return
  }

  lastRedeployAt = now

  const provider = (process.env.DEPLOY_PROVIDER ?? 'dokploy') as DeployProvider

  switch (provider) {
    case 'dokploy':
      return triggerDokployRedeploy(strapi)
    case 'vercel':
      return triggerVercelRedeploy(strapi)
    default:
      strapi.log.error(
        `[deploy] Unknown DEPLOY_PROVIDER value: "${provider}". Valid values: dokploy, vercel`
      )
  }
}

// ── Strapi lifecycle hook

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    void (async () => {
      await ensureContentLocales(strapi)
      await syncSpanishContentToEsAndEn(strapi)
    })()

    strapi.db.lifecycles.subscribe({
      models: REDEPLOY_TRIGGER_MODELS,

      async beforeUpdate(event) {
        const { params } = event
        // Only fetch previous state when publishedAt is being changed by this operation
        if (params.data?.publishedAt === undefined) return

        try {
          const existing = await strapi.db.query(event.model.uid).findOne({
            where: params.where,
            select: ['publishedAt'],
          })
          event.state.previousPublishedAt = existing?.publishedAt ?? null
        } catch (err) {
          strapi.log.error(
            `[deploy] beforeUpdate state capture failed: ${err instanceof Error ? err.message : String(err)}`
          )
        }
      },

      async afterUpdate(event) {
        const { result, state } = event

        // publishedAt was not part of this update
        if (state.previousPublishedAt === undefined) return
        // Was already published — not a null → value transition
        if (state.previousPublishedAt !== null) return
        // Still not published after update
        if (!(result as { publishedAt?: string | null })?.publishedAt) return

        await triggerRedeploy(strapi)
      },

      // Handles create-and-publish in a single action (Strapi v5 first-publish path)
      async afterCreate(event) {
        const { result } = event
        if (!(result as { publishedAt?: string | null })?.publishedAt) return

        await triggerRedeploy(strapi)
      },
    })
  },
}
