import { Inbox } from 'lucide-react'

export function EmptyBox() {
  return (
    <div className="h-full w-full flex items-center justify-center gap-2">
      <Inbox size={28} />
      <p className="text-2xl text-gray-400 font-light">
        Caixa de emprestimos vazia
      </p>
    </div>
  )
}
