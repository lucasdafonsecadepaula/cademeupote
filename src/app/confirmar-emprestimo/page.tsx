import { TopBar } from '@/components/top-bar'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ItemProps } from '../products/page'
import { AcceptButton } from './AcceptButton'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/')
  }

  const token = searchParams.token! as string

  const { data: dataItem } = await supabase
    .from('borrowed_items')
    .select('*')
    .eq('id', token)
    .single()
    .setHeader('token', token)

  if (!dataItem) return <>ERROR</>

  const { data: dataImage } = await supabase.storage
    .from('Items Emprestados')
    .createSignedUrl(dataItem.image_name, 60)

  const item = dataItem as ItemProps

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="h-[calc(100vh-180px)] flex items-center bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={dataImage?.signedUrl ?? ''}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <CardTitle className="text-xl font-medium mb-2">
                      {item.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-8 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Created on: {item.created_at}
                      </p>
                      {item.is_public ? (
                        <Badge variant="default">Public</Badge>
                      ) : (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <AcceptButton userId={user.id} token={token} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
