import { ProductListComponent } from '@/components/product-list'
import { TopBar } from '@/components/top-bar'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface ItemProps {
  id: string
  created_at: string
  name: string
  description: string
  created_by: string
  sent_to: null | string
  is_public: boolean
  has_returned: boolean
  image_name: string
  imageUrl: string | null
  is_my: boolean
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
    .order('id', { ascending: true })

  const items = itemsData as ItemProps[]
  const signedUrls = await Promise.all(
    items.map(async (item) => {
      const { data, error } = await supabase.storage
        .from('Items Emprestados')
        .createSignedUrl(item.image_name, 60) // 60 seconds expiration

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
    ...e,
    imageUrl: signedUrls[i],
    is_my: user.id === e.created_by,
  }))

  if (error) {
    return <>ERRO</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main>
        <ProductListComponent products={newItems ?? []} />
      </main>
    </div>
  )
}
