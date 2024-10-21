import { ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function TransactionInfo({
  lender,
  borrower,
}: {
  lender: { name: string; imageUrl: string }
  borrower: { name?: string | null; imageUrl?: string | null }
}) {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={lender.imageUrl} alt={lender.name} />
          <AvatarFallback className="bg-blue-500">
            {lender.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="ml-2 text-sm font-medium">{lender.name}</span>
      </div>
      {borrower.name ? (
        <>
          <ArrowRight className="mx-2" />
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">{borrower.name}</span>
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={borrower.imageUrl ?? ''} alt={borrower.name} />
              <AvatarFallback className="bg-primary">
                {borrower.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </>
      ) : null}
    </div>
  )
}
