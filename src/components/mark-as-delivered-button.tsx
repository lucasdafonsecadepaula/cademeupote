'use client'
import { ArrowLeft, Trash } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

export function MarkAsDeliveredButton({ id }: { id: string }) {
  const supabase = createSupabaseClient()
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function handleConfirmDelivere() {
    await supabase
      .from('borrowed_items')
      .update({
        has_returned: true,
      })
      .eq('id', id)
      .single()
    setIsModalOpen(false)
    window.location.reload()
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
              Deseja marcar esse emprestimo como entregue?
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
            >
              <Trash />
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
