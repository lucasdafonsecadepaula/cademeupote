'use client'
import { TopBar } from '@/components/top-bar'
import Image from 'next/image'
import logoImage from '@/assets/imgs/logo.png'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div>
      <TopBar />
      <main className="h-[50vh] flex gap-4 flex-col items-center justify-center">
        <Image alt="Logo" className="aspect-square h-32 w-32" src={logoImage} />
        <p className="text-base font-bold">Pote não encontrado</p>
        <Button onClick={() => router.push('/')}>
          Voltar para tela inicial
        </Button>
      </main>
    </div>
  )
}
