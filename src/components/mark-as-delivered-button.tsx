'use client'
import { ArrowLeft, LoaderPinwheel, Trash } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useState, useTransition } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function MarkAsDeliveredButton({ id }: { id: string }) {
  const supabase = createSupabaseClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleConfirmDelivere() {
    startTransition(async () => {
      await supabase
        .from('borrowed_items')
        .update({
          has_returned: true,
        })
        .eq('id', id)
        .single()
      setIsModalOpen(false)
      router.refresh()
    })
  }

  const changeModalStatus = (status: boolean) => () => {
    setIsModalOpen(status)
  }

  return (
    <>
      <Button onClick={changeModalStatus(true)}>Marcar como entregue</Button>
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => changeModalStatus(isOpen)()}
      >
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle>
              Deseja marcar esse empréstimo como entregue?
            </DialogTitle>
          </DialogHeader>
          <div className="flex py-6 gap-4">
            <Button
              onClick={changeModalStatus(false)}
              variant="outline"
              className="flex-grow"
            >
              <ArrowLeft />
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelivere}
              variant="destructive"
              className="flex-grow"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderPinwheel className="animate-spin" />
                  Confirmando
                </>
              ) : (
                <>
                  <Trash />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
