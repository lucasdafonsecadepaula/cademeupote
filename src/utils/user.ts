import { User } from '@supabase/supabase-js'

export function getUserMetadata(user: User | null) {
  const name = (user?.user_metadata?.name ?? '') as string
  const avatarUrl = (user?.user_metadata?.avatar_url ?? '') as string
  return { name, avatarUrl }
}
