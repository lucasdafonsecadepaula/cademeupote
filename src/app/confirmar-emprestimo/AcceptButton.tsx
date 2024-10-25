'use client'

import { Button } from '@/components/ui/button'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import googleIcon from '@/assets/svgs/google.svg'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { AlertCircle, LoaderPinwheel } from 'lucide-react'
import { acceptBorrowedItem } from '@/lib/supabase/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ClientProps {
  token: string
  userId: string | undefined
  userName: string | undefined
  userImageUrl: string | undefined
}

export function AcceptButton({
  token,
  userId,
  userName = '',
  userImageUrl = '',
}: ClientProps) {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [isPending, startTransition] = useTransition()
  const [hasError, setHasError] = useState(false)

  function handleClickAccept() {
    startTransition(async () => {
      if (!userId) return

      const [, error] = await acceptBorrowedItem(supabase, {
        token,
        userId,
        userImageUrl,
        userName,
      })

      if (error) {
        setHasError(true)
        setTimeout(() => {
          setHasError(false)
        }, 3000)
      } else {
        router.prefetch('/')
        router.push('/')
      }
    })
  }

  function handleLogin() {
    startTransition(async () => {
      const redirectURL = encodeURIComponent(
        window.location.href.replace(window.location.origin, ''),
      )
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${redirectURL}`,
        },
      })
    })
  }

  return (
    <div className="pt-4">
      {hasError ? (
        <Alert variant="destructive" className="max-w-md mx-auto mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ocorreu algum erro</AlertTitle>
          <AlertDescription>Tente novamente</AlertDescription>
        </Alert>
      ) : null}

      {userId ? (
        <>
          <Button
            onClick={handleClickAccept}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderPinwheel className="animate-spin" />
                Aceitando empréstimo
              </>
            ) : (
              'Aceitar empréstimo'
            )}
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleLogin} disabled={isPending}>
            <Image
              src={googleIcon}
              alt="google icon"
              height={28}
              width={28}
              className="bg-white rounded-lg"
            />
            Logue com uma conta google para confirmar
          </Button>
        </>
      )}
    </div>
  )
}
