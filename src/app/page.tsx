'use client'
import { ResponsiveHeroComponent } from '@/components/responsive-hero'
import { TopBar } from '@/components/top-bar'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function Home() {
  const supabase = createSupabaseClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main>
        <ResponsiveHeroComponent handleLogin={handleLogin} />
      </main>
    </div>
  )
}
