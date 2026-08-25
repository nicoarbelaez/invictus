/** CMS HTTP error (server responded with non-OK status). */
export class StrapiError extends Error {
  readonly userMessage: string
  readonly status: number
  readonly statusText: string
  readonly details: unknown
  readonly errorName: string | undefined

  constructor(
    message: string,
    userMessage: string,
    status: number,
    statusText: string,
    details?: unknown,
    errorName?: string
  ) {
    super(message)
    this.name = 'StrapiError'
    this.userMessage = userMessage
    this.status = status
    this.statusText = statusText
    this.details = details
    this.errorName = errorName
  }
}

/** Network / DNS / timeout — request never reached Strapi. */
export class StrapiConnectionError extends Error {
  readonly url: string
  override readonly cause: Error | undefined

  constructor(message: string, url: string, cause?: Error) {
    super(message)
    this.name = 'StrapiConnectionError'
    this.url = url
    this.cause = cause
  }
}

export function isStrapiError(error: unknown): error is StrapiError {
  return error instanceof StrapiError
}

export function isStrapiErrorOf(error: unknown, errorName: string): error is StrapiError {
  return isStrapiError(error) && error.errorName === errorName
}
