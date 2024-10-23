'use client'

import { MouseEvent, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InstallBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [supportsPWA, setSupportsPWA] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promptInstall, setPromptInstall] = useState<null | any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setSupportsPWA(true)
      setPromptInstall(e)
    }

    // Fix: 'beforeinstallprompt' in cleanup, not 'transitionend'
    window.addEventListener('beforeinstallprompt', handler)

    // Check if app is installed
    const checkInstallation = () => {
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as unknown as any).standalone === true
      ) {
        setIsInstalled(true)
      }
    }

    // Check on load
    checkInstallation()

    // Also check for display mode changes
    window
      .matchMedia('(display-mode: standalone)')
      .addEventListener('change', checkInstallation)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window
        .matchMedia('(display-mode: standalone)')
        .removeEventListener('change', checkInstallation)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleInstall = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault()
    if (promptInstall) {
      await promptInstall.prompt()
      const result = await promptInstall.userChoice
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
      }
    }
  }

  if (!supportsPWA || isInstalled || !isVisible) {
    return null
  }

  return (
    <div className="w-full py-2 px-4 sm:px-6 lg:px-8 border rounded-md">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Baixe nosso aplicativo para uma melhor experiência!
          </p>
        </div>
        <div className="flex-shrink-0 order-2 mt-2 sm:order-3 sm:mt-0 sm:ml-3">
          <Button onClick={handleInstall} size="sm" className="mr-2">
            Instalar
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="hover:bg-primary-foreground hover:text-primary"
          >
            <span className="sr-only">Fechar</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
