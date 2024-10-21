import { TopBar } from '@/components/top-bar'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TableBorrowedItemsProps } from '../area-particular/page'
import { AcceptButton } from './AcceptButton'
import { BorrowedCard } from '@/components/borrowed-card'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!searchParams.token) {
    return redirect('/')
  }

  const token = searchParams.token as string

  const { data: dataItem } = (await supabase
    .from('borrowed_items')
    .select('*')
    .eq('id', token)
    .single()
    .setHeader('token', token)) as { data: TableBorrowedItemsProps }

  if (!dataItem) return <>ERROR</>

  const { data: dataImage } = await supabase.storage
    .from('Items Emprestados')
    .createSignedUrl(dataItem.image_name, 60 * 60)

  const iLended = user ? user.id === dataItem.created_by : false
  const iBorrowed = user ? user.id === dataItem.sent_to : false

  const cardProps = {
    id: dataItem.id,
    iLended,
    iBorrowed,
    name: dataItem.name,
    description: dataItem.description,
    imageUrl: dataImage?.signedUrl ?? '',
    createdAt: dataItem.created_at,
    createdBy: dataItem.created_by,
    isPublic: dataItem.is_public,
    lender: { name: dataItem.lender_name, imageUrl: dataItem.lender_image_url },
    borrower: {
      name: dataItem.borrower_name,
      imageUrl: dataItem.borrower_image_url,
    },
  }

  const userName = user?.user_metadata?.name as string | undefined
  const userImageUrl = user?.user_metadata?.avatar_url as string | undefined

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="h-[calc(100vh-180px)] flex items-center bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <BorrowedCard
            {...cardProps}
            actionElement={
              <AcceptButton
                userId={user?.id}
                token={token}
                userName={userName}
                userImageUrl={userImageUrl}
              />
            }
          />
        </div>
      </main>
    </div>
  )
}
