import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyBox } from './empty-box'
import { BorrowedCard, BorrowedCardProps } from './borrowed-card'

export function ScrollAreaWithBorrowedItemsCard({
  cards,
}: {
  cards: BorrowedCardProps[]
}) {
  return (
    <ScrollArea className="h-[calc(100vh-233px)] border rounded-lg relative">
      {cards.map((card) => (
        <BorrowedCard key={card.item.id} {...card} />
      ))}

      {cards.length === 0 ? <EmptyBox /> : null}
    </ScrollArea>
  )
}
