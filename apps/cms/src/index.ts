import type { Core } from '@strapi/strapi'

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

async function triggerRedeploy(strapi: Core.Strapi): Promise<void> {
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
