import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let listeners = new Set<(available: boolean) => void>()

function notify() {
  const available = deferredPrompt !== null
  listeners.forEach((fn) => fn(available))
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e as BeforeInstallPromptEvent
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  notify()
})

export function usePwaInstall() {
  const [installable, setInstallable] = useState(deferredPrompt !== null)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    const handler = (available: boolean) => setInstallable(available)
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  const install = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        deferredPrompt = null
        notify()
      }
      return
    }
    // No deferred prompt available — show guidance
    setShowGuide(true)
    setTimeout(() => setShowGuide(false), 5000)
  }, [])

  return { installable, install, showGuide }
}
