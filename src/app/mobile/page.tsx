import NotificationPermissionCard from '@/components/notification-permission-card'
import { ToLoanButton } from '@/components/to-loan-button'
import { TopBar } from '@/components/top-bar'

export default function Mobile() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main>
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6">Empréstimo</h1>
            <ToLoanButton />
          </div>
        </div>
      </main>
      <NotificationPermissionCard />
    </div>
  )
}
