import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TransactionInfo } from './transaction-info'
import { MarkAsDeliveredButton } from './mark-as-delivered-button'
import { ShareBorrowedItem } from './share-borrowed-item'
import { CanShow } from './can-show'
import { ReactNode } from 'react'
import { IBorrowedItemSchema } from '@/lib/supabase/schemas'

function ShowCreatedDate({
  iLended,
  iBorrowed,
  createdAt,
}: {
  iLended: boolean
  iBorrowed: boolean
  createdAt: string
}) {
  let loanText = ''
  if (iLended) loanText = 'Emprestou no dia: '
  if (iBorrowed) loanText = 'Pegou emprestado no dia:'
  if (!iLended && !iBorrowed) loanText = 'Empréstimo ocorreu no dia:'

  const formattedDate = format(new Date(createdAt), 'dd/MM/yyyy')

  return (
    <p className="text-sm text-muted-foreground">
      {`${loanText} ${formattedDate}`}
    </p>
  )
}

function CustomBadge({ isPublic }: { isPublic: boolean }) {
  const badgeProps = isPublic
    ? {
        variant: 'default' as const,
        className: 'bg-blue-500 hover:bg-blue-500',
        text: 'Public',
      }
    : { variant: 'outline' as const, text: 'Private' }

  return (
    <Badge variant={badgeProps.variant} className={badgeProps.className}>
      {badgeProps.text}
    </Badge>
  )
}

function BorrowedTextStatus({
  lenderName,
  borrowerName,
  iLended,
  iBorrowed,
  createdAt,
}: {
  borrowerName?: string | null
  lenderName: string
  iLended: boolean
  iBorrowed: boolean
  createdAt: string
}) {
  if (!borrowerName && iLended) {
    return (
      <p className="text-sm font-bold">
        Quem recebeu o item ainda não confirmou no link. Por favor, reenvie o
        link para que possamos notificá-la, se necessário.
      </p>
    )
  }

  if (!borrowerName) {
    return <p className="text-sm font-bold">Você aceita o empréstimo de: </p>
  }

  const distanceToNowString = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  if (iLended) {
    return (
      <p className="text-sm font-bold">
        Você emprestou para {borrowerName} {distanceToNowString}
      </p>
    )
  }

  if (iBorrowed) {
    return (
      <p className="text-sm font-bold">
        Você pegou emprestado de {lenderName} {distanceToNowString}
      </p>
    )
  }

  return (
    <p className="text-sm font-bold">
      {lenderName} emprestou para {borrowerName} {distanceToNowString}
    </p>
  )
}

export type BorrowedCardProps = {
  item: IBorrowedItemSchema
  itemImageUrl: string
  iLended: boolean
  iBorrowed: boolean
  actionElement?: ReactNode
}

export function BorrowedCard({
  item,
  itemImageUrl,
  iLended,
  iBorrowed,
  actionElement,
}: BorrowedCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 relative">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image
              src={itemImageUrl ?? ''}
              alt={item.name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col justify-between flex-grow">
            <CardTitle className="text-xl font-medium mb-2">
              {item.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-4">
              {item.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <ShowCreatedDate
                iLended={iLended}
                iBorrowed={iBorrowed}
                createdAt={item.created_at}
              />

              <CustomBadge isPublic={item.is_public} />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <BorrowedTextStatus
                lenderName={item.lender_name}
                borrowerName={item.borrower_name}
                iLended={iLended}
                iBorrowed={iBorrowed}
                createdAt={item.created_at}
              />
            </div>

            <TransactionInfo
              lender={{
                name: item.lender_name,
                imageUrl: item.lender_image_url,
              }}
              borrower={{
                name: item.borrower_name,
                imageUrl: item.borrower_image_url,
              }}
            />

            {actionElement}

            <CanShow isShowing={iLended}>
              <div className="flex justify-between items-end mt-8 flex-wrap-reverse gap-3">
                <div>
                  <MarkAsDeliveredButton id={item.id} />
                </div>
                <div>
                  <ShareBorrowedItem id={item.id} />
                </div>
              </div>
            </CanShow>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
