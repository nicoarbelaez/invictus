import * as React from 'react'

interface UseShareProps {
  title: string
  description: string
  shareUrl?: string
  onShare?: () => void
}

export function useShare({ title, description, shareUrl, onShare }: UseShareProps) {
  const [shareFeedback, setShareFeedback] = React.useState(false)

  const handleShare = React.useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const url = shareUrl ?? window.location.href

      if (window.navigator && window.navigator.share) {
        await window.navigator.share({
          title,
          text: description,
          url,
        })
      } else if (window.navigator && window.navigator.clipboard) {
        await window.navigator.clipboard.writeText(url)

        setShareFeedback(true)

        window.setTimeout(() => {
          setShareFeedback(false)
        }, 1500)
      }

      onShare?.()
    } catch {
      onShare?.()
    }
  }, [description, onShare, shareUrl, title])

  return {
    handleShare,
    shareFeedback,
  }
}
