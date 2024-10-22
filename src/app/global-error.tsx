'use client'
import { TopBar } from '@/components/top-bar'
import Image from 'next/image'
import logoImage from '@/assets/imgs/logo.png'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <TopBar />
        <h2>Something went wrong!</h2>
        <button>Try again</button>
        <main className="min-h-screen flex flex-col items-center justify-center">
          <Image
            alt="Logo"
            className="aspect-square h-32 w-32"
            src={logoImage}
          />
          <p className="text-base font-bold">Ocorreu algum erro inesperado</p>
          <Button onClick={() => reset()}>Tentar novamente</Button>
        </main>
      </body>
    </html>
  )
}
