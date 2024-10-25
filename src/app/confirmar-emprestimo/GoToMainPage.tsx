'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function GoToMainPage() {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.prefetch('/')
        router.push('/')
      }}
      variant="outline"
    >
      <ArrowLeft /> Voltar para página principal
    </Button>
  )
}
