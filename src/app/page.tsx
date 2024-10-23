import { ResponsiveHeroComponent } from '@/components/responsive-hero'
import { TopBar } from '@/components/top-bar'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main>
        <ResponsiveHeroComponent />
      </main>
    </div>
  )
}
