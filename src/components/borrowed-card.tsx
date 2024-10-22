import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ItemProps } from '@/app/area-particular/page'
import { TransactionInfo } from './transaction-info'
import { MarkAsDeliveredButton } from './mark-as-delivered-button'
import { ShareBorrowedItem } from './share-borrowed-item'
import { CanShow } from './can-show'
import { ReactNode } from 'react'

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

type BorrowedCardProps = ItemProps & { actionElement?: ReactNode }

export function BorrowedCard({
  imageUrl,
  name,
  description,
  iLended,
  iBorrowed,
  createdAt,
  isPublic,
  borrower,
  lender,
  id,
  actionElement,
}: BorrowedCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 relative">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image
              src={imageUrl ?? ''}
              alt={name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col justify-between flex-grow">
            <CardTitle className="text-xl font-medium mb-2">{name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>

            <div className="flex items-center gap-2 mb-4">
              <ShowCreatedDate
                iLended={iLended}
                iBorrowed={iBorrowed}
                createdAt={createdAt}
              />

              <CustomBadge isPublic={isPublic} />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <BorrowedTextStatus
                lenderName={lender.name}
                borrowerName={borrower.name}
                iLended={iLended}
                iBorrowed={iBorrowed}
                createdAt={createdAt}
              />
            </div>

            <TransactionInfo lender={lender} borrower={borrower} />

            {actionElement}

            <CanShow isShowing={iLended}>
              <div className="flex justify-between items-end mt-8 flex-wrap-reverse gap-3">
                <div>
                  <MarkAsDeliveredButton id={id} />
                </div>
                <div>
                  <ShareBorrowedItem id={id} />
                </div>
              </div>
            </CanShow>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
