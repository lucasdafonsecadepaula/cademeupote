import { Inbox } from 'lucide-react'

export function EmptyBox() {
  return (
    <div className="h-full w-full flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-400">
      <Inbox size={28} color="#9ca3af" />
      <p className="text-2xl text-gray-400 font-light">
        Caixa de empréstimos vazia
      </p>
    </div>
  )
}
