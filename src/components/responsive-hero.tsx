'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import momImage from '@/assets/imgs/mom.jpg'
import { motion } from 'framer-motion'

interface ResponsiveHeroComponentProps {
  handleLogin?: () => void
}

export function ResponsiveHeroComponent({
  handleLogin,
}: ResponsiveHeroComponentProps) {
  return (
    <section className="flex-grow flex justify-center w-full py-12 md:py-24 lg:py-32">
      <div className="w-full max-w-[1600px] container px-4 md:px-6">
        <div className="w-full grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="lg:order-last relative overflow-hidden">
            <Image
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-contain object-center md:max-h-[400px] md:max-w-[400px] h-full max-h-[200px] max-w-[200px]"
              src={momImage}
            />
            <div className="absolute top-[10%] md:right-[52px] right-[22px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 1 }}
                className="max-w-xs text-xs lg:text-base rounded-2xl py-2 px-3 text-white bg-blue-500 rounded-bl-none"
              >
                Cadê meu pote?
              </motion.div>
            </div>
            <div className="absolute top-[30%] md:left-[52px] left-[22px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 2 }}
                className="max-w-xs text-xs lg:text-base rounded-2xl py-2 px-3 text-white bg-gray-500 rounded-br-none "
              >
                Não está comigo
              </motion.div>
            </div>
            <div className="absolute top-[50%] md:right-[16px] right-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 2.5 }}
                className="max-w-xs text-xs lg:text-base rounded-2xl py-2 px-3 text-white bg-blue-500 rounded-bl-none"
              >
                Eu quero meu pote 😤
              </motion.div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Cadê meu pote??
              </h1>
              <h2 className="max-w-[600px] text-gray-600 md:text-xl">
                Evite que seus potes fiquem sem volta!
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Crie sua conta agora e registre todos os seus empréstimos. Nós
                cuidamos dos lembretes para você.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button onClick={handleLogin}>EMPRESTE AGORA</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
