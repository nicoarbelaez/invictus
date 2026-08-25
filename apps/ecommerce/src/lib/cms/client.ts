import qs from 'qs'
import { CMS_URL, CMS_TOKEN } from 'astro:env/server'
import type {
  StrapiListResponse,
  StrapiSingleResponse,
  Producto,
  Categoria,
  Global,
} from '@/lib/cms'
import { StrapiError, StrapiConnectionError, isStrapiError, isStrapiErrorOf } from './errors'

export { StrapiError, StrapiConnectionError, isStrapiError, isStrapiErrorOf }

// ─── Query params

export type FilterValue =
  | string
  | number
  | boolean
  | null
  | FilterValue[]
  | { [key: string]: FilterValue }

export interface QueryParams {
  fields?: string[]
  filters?: Record<string, unknown>
  sort?: string | string[]
  populate?: Record<string, unknown> | string[] | true
  pagination?: { page?: number; pageSize?: number; start?: number; limit?: number }
}

// ─── Base fetch

const DEFAULT_TIMEOUT_MS = 10_000

async function strapiRequest<T>(path: string, params?: QueryParams): Promise<T> {
  const baseUrl = CMS_URL.replace(/\/+$/, '')
  const query = params ? qs.stringify(params, { encodeValuesOnly: true, skipNulls: true }) : ''
  const url = `${baseUrl}/api/${path.replace(/^\/+/, '')}${query ? `?${query}` : ''}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(CMS_TOKEN ? { Authorization: `Bearer ${CMS_TOKEN}` } : {}),
      },
    })
  } catch (cause) {
    clearTimeout(timer)
    throw new StrapiConnectionError(
      cause instanceof Error ? cause.message : 'Network error',
      url,
      cause instanceof Error ? cause : undefined
    )
  }
  clearTimeout(timer)

  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = body?.error ?? {}
    throw new StrapiError(
      `Strapi responded with ${response.status}`,
      error.message ?? response.statusText,
      response.status,
      response.statusText,
      error.details,
      error.name
    )
  }

  return body as T
}

// ─── Collection resource

class Collection<T> {
  constructor(private readonly endpoint: string) {}

  /** Returns flat entity array (pagination metadata discarded). */
  async find(params?: QueryParams): Promise<T[]> {
    const res = await strapiRequest<StrapiListResponse<T>>(this.endpoint, params)
    return res.data
  }

  /** Returns entity array WITH pagination metadata. */
  async findWithMeta(params?: QueryParams): Promise<StrapiListResponse<T>> {
    return strapiRequest<StrapiListResponse<T>>(this.endpoint, params)
  }

  /** Returns single entity by documentId, or null if not found. */
  async findOne(
    documentId: string,
    params?: Omit<QueryParams, 'pagination' | 'filters' | 'sort'>
  ): Promise<T | null> {
    try {
      const res = await strapiRequest<StrapiSingleResponse<T>>(
        `${this.endpoint}/${documentId}`,
        params
      )
      return res.data
    } catch (e) {
      if (isStrapiError(e) && e.status === 404) return null
      throw e
    }
  }
}

// ─── Single-type resource

class SingleType<T> {
  constructor(private readonly endpoint: string) {}

  async find(params?: Omit<QueryParams, 'pagination' | 'sort'>): Promise<T> {
    const res = await strapiRequest<StrapiSingleResponse<T>>(this.endpoint, params)
    return res.data
  }
}

// ─── Typed CMS client
// Mirrors the class that `npx strapi-types generate` would emit.

export const cms = {
  productos: new Collection<Producto>('productos'),
  categorias: new Collection<Categoria>('categorias'),
  globals: new SingleType<Global>('globals'),
} as const
