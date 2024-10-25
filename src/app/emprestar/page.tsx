import NotificationPermissionCard from '@/components/notification-permission-card'
import { ToLoanComponent } from '@/components/to-loan-component'
import { TopBar } from '@/components/top-bar'
import { getUser } from '@/lib/supabase/queries'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createSupabaseServer()

  const user = await getUser(supabase)

  if (!user) {
    return redirect('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main>
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4 pt-16">
            <ToLoanComponent />
          </div>
        </div>
      </main>
      <NotificationPermissionCard />
    </div>
  )
}
