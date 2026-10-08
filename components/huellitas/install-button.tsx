'use client'

import { useEffect, useState } from 'react'
import { Download, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null

  const install = async () => {
    if (!deferred) {
      setShowHelp(true)
      return
    }
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferred(null)
  }

  return (
    <>
      <Button
        onClick={install}
        size="sm"
        className="bg-white font-bold text-secondary hover:bg-white/90"
      >
        <Download />
        Instalar
      </Button>
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-secondary">Instalá Huellitas a Casa</DialogTitle>
            <DialogDescription>Tenela en tu celular como una app, sin pasar por la tienda.</DialogDescription>
          </DialogHeader>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm">
            <li>
              <strong>iPhone (Safari):</strong> tocá <Share className="inline size-4" aria-label="Compartir" /> y
              elegí &quot;Agregar a inicio&quot;.
            </li>
            <li>
              <strong>Android (Chrome):</strong> abrí el menú ⋮ y elegí &quot;Instalar app&quot;.
            </li>
            <li>
              <strong>Computadora:</strong> usá el ícono de instalar en la barra de direcciones.
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  )
}
