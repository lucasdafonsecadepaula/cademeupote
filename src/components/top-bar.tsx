'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, LogOut } from 'lucide-react'
import Image from 'next/image'
import logoImage from '@/assets/imgs/logo.png'
import { createSupabaseClient } from '@/lib/supabase/client'

export function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function test() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoggedIn(false)
        return
      }
      setUserName(user.user_metadata?.name ?? '')
      setAvatarUrl(user.user_metadata?.avatar_url ?? '')
      setIsLoggedIn(true)
    }

    test()
  }, [supabase.auth])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full py-2 px-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-lg flex items-center gap-2">
          <Image alt="Logo" className="aspect-square h-8 w-8" src={logoImage} />
          cademeupote
        </div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback>
                {userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{userName}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={handleLogin}>
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        )}
      </div>
    </div>
  )
}
