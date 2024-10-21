import { ScrollAreaWithBorrowedItemsCard } from '@/components/scroll-area-with-borrowed-itens-card'
import { ToLoanButton } from '@/components/to-loan-button'
import { TopBar } from '@/components/top-bar'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface TableBorrowedItemsProps {
  id: string
  created_at: string
  name: string
  description?: string
  created_by: string
  sent_to?: null | string
  is_public: boolean
  has_returned: boolean
  image_name: string
  lender_name: string
  lender_image_url: string
  borrower_name?: null | string
  borrower_image_url?: null | string
}

export interface ItemProps {
  id: string
  createdAt: string
  name: string
  description?: string
  createdBy: string
  sentTo?: null | string
  isPublic: boolean
  imageUrl?: string | null
  iLended: boolean
  iBorrowed: boolean
  lender: {
    name: string
    imageUrl: string
  }
  borrower: {
    name?: null | string
    imageUrl?: null | string
  }
}

export default async function Page() {
  const supabase = createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/')
  }

  const { data: itemsData, error } = await supabase
    .from('borrowed_items')
    .select('*')
    .eq('has_returned', false)
    .order('created_at', { ascending: true })

  const items = (itemsData ?? []) as TableBorrowedItemsProps[]

  const signedUrls = await Promise.all(
    items.map(async (item) => {
      const { data, error } = await supabase.storage
        .from('Items Emprestados')
        .createSignedUrl(item.image_name, 60 * 60) // 1 hour expiration

      if (error) {
        console.error(
          `Error generating signed URL for ${item.image_name}:`,
          error,
        )
        return null // Handle error as needed
      }
      return data.signedUrl
    }),
  )

  const newItems = items.map((e, i) => ({
    id: e.id,
    createdAt: e.created_at,
    name: e.name,
    description: e.description,
    createdBy: e.created_by,
    sentTo: e.sent_to,
    isPublic: e.is_public,
    imageUrl: signedUrls[i],
    iLended: user.id === e.created_by,
    iBorrowed: user.id === e.sent_to,
    lender: {
      name: e.lender_name,
      imageUrl: e.lender_image_url,
    },
    borrower: {
      name: e.borrower_name,
      imageUrl: e.borrower_image_url,
    },
  })) as ItemProps[]

  if (error) {
    return <>ERRO</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main>
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6">Emprestimos</h1>
            <ScrollAreaWithBorrowedItemsCard items={newItems} />
            <ToLoanButton />
          </div>
        </div>
      </main>
    </div>
  )
}
