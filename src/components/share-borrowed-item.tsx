'use client'
import { Check, Copy, Share2 } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import whatsappIcon from '@/assets/svgs/whatsapp.svg'

export function ShareBorrowedItem({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const sharedLink = `${window.origin}/confirmar-emprestimo?token=${id}`

  const changeModalStatus = (status: boolean) => () => {
    setIsModalOpen(status)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  function handleShareWithWhatsapp() {
    const messageText = encodeURIComponent(`${sharedLink}`)
    const shareUrl = `https://wa.me/?text=${messageText}`
    window.open(shareUrl, '_blank')
  }

  return (
    <>
      <Button variant="outline" onClick={changeModalStatus(true)}>
        <Share2 className="h-4 w-4" />
        <span className="hidden min-[440px]:block">Compartilhar</span>
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => changeModalStatus(isOpen)()}
      >
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle>
              Compartilhe o link para quem pegou emprestado
            </DialogTitle>
            <DialogDescription>
              Último passo, compartilhe o link abaixo apenas com a pessoa que
              pegou emprestado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 w-full">
              <Input value={sharedLink} readOnly />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(id)}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
            <div className="flex flex-wrap sm:justify-center gap-2 sm:gap-4">
              <Button onClick={handleShareWithWhatsapp} variant="outline">
                <Image
                  src={whatsappIcon}
                  alt="whatsapp icon"
                  height={16}
                  width={16}
                />
                Compartilhe com Whatsapp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
