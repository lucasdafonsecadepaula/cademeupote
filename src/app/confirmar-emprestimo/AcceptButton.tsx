'use client'

import { Button } from '@/components/ui/button'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ClientProps {
  userId: string
  token: string
}

export function AcceptButton({ token, userId }: ClientProps) {
  const { push } = useRouter()
  const supabase = createSupabaseClient()
  async function handleClickAccept() {
    await supabase
      .from('borrowed_items')
      .update({ sent_to: userId })
      .eq('id', token)
      .single()
      .setHeader('token', token)

    push('/')
  }

  return (
    <>
      <Button onClick={handleClickAccept} className="w-full">
        Aceitar emprestimo
      </Button>
    </>
  )
}
