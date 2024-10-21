import { ScrollArea } from '@/components/ui/scroll-area'
import { ItemProps } from '@/app/area-particular/page'
import { EmptyBox } from './empty-box'
import { BorrowedCard } from './borrowed-card'

export function ScrollAreaWithBorrowedItemsCard({
  items,
}: {
  items: ItemProps[]
}) {
  return (
    <ScrollArea className="h-[calc(100vh-233px)] border rounded-lg relative">
      {items.map((item) => (
        <BorrowedCard key={item.id} {...item} />
      ))}

      {items.length === 0 ? <EmptyBox /> : null}
    </ScrollArea>
  )
}
