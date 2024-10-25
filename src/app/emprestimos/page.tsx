import NotificationPermissionCard from '@/components/notification-permission-card'
import { ScrollAreaWithBorrowedItemsCard } from '@/components/scroll-area-with-borrowed-itens-card'
import { TopBar } from '@/components/top-bar'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ToLoanClientButton } from './clientButton'
import InstallBanner from '@/components/install-banner'
import {
  getMyBorrowedItems,
  getStorageImagesByName,
  getUser,
} from '@/lib/supabase/queries'

export default async function Page() {
  const supabase = createSupabaseServer()

  const user = await getUser(supabase)

  if (!user) {
    return redirect('/')
  }

  const [items, error] = await getMyBorrowedItems(supabase)

  if (error) return redirect('/')

  const imageNames = items
    .filter((e) => !!e.image_name)
    .map((e) => e.image_name) as string[]

  const [signedUrls] = await getStorageImagesByName(supabase, imageNames)

  const cards = items.map((e, i) => ({
    item: e,
    itemImageUrl: signedUrls[i] ?? '',
    iLended: user.id === e.created_by,
    iBorrowed: user.id === e.sent_to,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <InstallBanner />
      <TopBar />
      <main>
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6">Empréstimo</h1>
            <ScrollAreaWithBorrowedItemsCard cards={cards} />
            <ToLoanClientButton />
          </div>
        </div>
      </main>
      <NotificationPermissionCard />
    </div>
  )
}
