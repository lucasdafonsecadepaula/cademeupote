'use client'
import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { subscribeUser, unsubscribeUser } from '@/app/actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+') // Fixed here
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function NotificationPermissionCard() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  )
  const [, setIsIOS] = useState(false)
  const [, setIsStandalone] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (subscription) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [subscription])

  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    })
    setSubscription(sub)
    await subscribeUser(sub)
    setIsOpen(false)
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
    setIsOpen(false)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isSupported && isOpen ? (
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notificações não são suportadas neste navegador.
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 p-0"
              onClick={toggleOpen}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Bell className="h-8 w-8 text-primary" />
              <p className="text-sm text-muted-foreground">
                Utilize outro navegador para melhor experiência.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={toggleOpen}>
              Continuar usando
            </Button>
          </CardFooter>
        </Card>
      ) : null}
      {!isSupported && !isOpen ? (
        <Button
          className="rounded-full w-12 h-12 shadow-lg flex items-center justify-center p-0"
          onClick={toggleOpen}
        >
          <Bell className="h-6 w-6" />
          <span className="sr-only">Abrir configurações de notificação</span>
        </Button>
      ) : null}

      {isSupported && isOpen ? (
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {subscription
                ? 'Você está com as notificações ativas'
                : 'Habilitar notificações'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 p-0"
              onClick={toggleOpen}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Bell className="h-8 w-8 text-primary" />
              <p className="text-sm text-muted-foreground">
                {subscription
                  ? 'Bloquear as notificações faz com que você tenha uma experiência limitada.'
                  : 'Receba notificações e melhore sua experiência utilizando o app.'}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {subscription ? (
              <>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={unsubscribeFromPush}
                >
                  Bloquear notificações
                </Button>
                <Button size="sm" variant="outline" onClick={toggleOpen}>
                  Fechar
                </Button>
              </>
            ) : null}

            {!subscription ? (
              <Button size="sm" onClick={subscribeToPush}>
                Permitir notificações
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      ) : null}
      {isSupported && !isOpen ? (
        <Button
          className="rounded-full w-12 h-12 shadow-lg flex items-center justify-center p-0"
          onClick={toggleOpen}
        >
          <Bell className="h-6 w-6" />
          <span className="sr-only">Abrir configurações de notificação</span>
        </Button>
      ) : null}
    </div>
  )
}
