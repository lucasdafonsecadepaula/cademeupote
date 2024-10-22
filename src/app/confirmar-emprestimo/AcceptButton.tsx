'use client'

import { Button } from '@/components/ui/button'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import googleIcon from '@/assets/svgs/google.svg'
import Image from 'next/image'
import { useTransition } from 'react'
import { LoaderPinwheel } from 'lucide-react'

interface ClientProps {
  token: string
  userId: string | undefined
  userName: string | undefined
  userImageUrl: string | undefined
}

export function AcceptButton({
  token,
  userId,
  userName,
  userImageUrl,
}: ClientProps) {
  const { push } = useRouter()
  const supabase = createSupabaseClient()
  const [isPending, startTransition] = useTransition()

  function handleClickAccept() {
    startTransition(async () => {
      if (!userName || !userId) return
      await supabase
        .from('borrowed_items')
        .update({
          sent_to: userId,
          borrower_name: userName,
          borrower_image_url: userImageUrl ?? '',
        })
        .eq('id', token)
        .single()
        .setHeader('token', token)

      push('/')
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
