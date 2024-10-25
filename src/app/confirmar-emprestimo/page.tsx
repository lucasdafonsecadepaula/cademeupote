import { TopBar } from '@/components/top-bar'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AcceptButton } from './AcceptButton'
import { BorrowedCard } from '@/components/borrowed-card'
import {
  getBorrowedItemByToken,
  getStorageImage,
  getUser,
} from '@/lib/supabase/queries'
import { getUserMetadata } from '@/utils'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (!searchParams.token) return redirect('/')

  const supabase = createSupabaseServer()
  const user = await getUser(supabase)
  const token = searchParams.token as string

  const [item, error] = await getBorrowedItemByToken(supabase, token)

  if (error || !item) return redirect('/')

  const imageName = item.image_name ?? ''

  const [imageSignedUrl, erro] = await getStorageImage(supabase, imageName)
  if (erro) console.log('getStorageImage ', erro)

  const iLended = user ? user.id === item.created_by : false
  const iBorrowed = user ? user.id === item.sent_to : false

  const { name, avatarUrl } = getUserMetadata(user)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="h-[calc(100vh-180px)] flex items-center bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <BorrowedCard
            item={item}
            itemImageUrl={imageSignedUrl ?? ''}
            iLended={iLended}
            iBorrowed={iBorrowed}
            actionElement={
              !item.sent_to ? (
                <AcceptButton
                  userId={user?.id}
                  token={token}
                  userName={name}
                  userImageUrl={avatarUrl}
                />
              ) : null
            }
          />
        </div>
      </main>
    </div>
  )
}
