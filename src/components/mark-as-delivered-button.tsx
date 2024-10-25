'use client'
import { AlertCircle, ArrowLeft, LoaderPinwheel, Trash } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useState, useTransition } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { markAsDeliveredQuery } from '@/lib/supabase/queries'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export function MarkAsDeliveredButton({ id }: { id: string }) {
  const supabase = createSupabaseClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [hasError, setHasError] = useState(false)
  const router = useRouter()

  function handleConfirmDelivere() {
    startTransition(async () => {
      const { error } = await markAsDeliveredQuery(supabase, id)
      if (error) {
        setHasError(true)
        setTimeout(() => {
          setHasError(false)
        }, 3000)
      } else {
        setIsModalOpen(false)
        router.refresh()
      }
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

          {hasError ? (
            <Alert variant="destructive" className="max-w-md mx-auto mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ocorreu algum erro</AlertTitle>
              <AlertDescription>Tente novamente</AlertDescription>
            </Alert>
          ) : null}

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
