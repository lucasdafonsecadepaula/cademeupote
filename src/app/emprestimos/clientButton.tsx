'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ToLoanClientButton() {
  const router = useRouter()

  return (
    <Button
      className="w-full"
      onClick={() => {
        router.prefetch('/emprestimos')
        router.push('/emprestar')
      }}
    >
      <Plus className="mr-2 h-4 w-4" />
      Emprestar
    </Button>
  )
}
