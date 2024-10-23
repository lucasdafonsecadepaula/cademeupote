'use server'

import { createSupabaseServer } from '@/lib/supabase/server'
import webpush from 'web-push'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'mailto:example@yourdomain.org'

webpush.setVapidDetails(
  defaultUrl,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function subscribeUser(sub: PushSubscription) {
  try {
    const supabase = createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not Authenticated' }

    const { error } = await supabase
      .from('subscription')
      .upsert({ sub: JSON.stringify(sub), is_active: true })
      .eq('id', user.id)

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('subscribeUser', error)
    return { success: false, message: 'Unknow error' }
  }
}

export async function unsubscribeUser() {
  try {
    const supabase = createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not Authenticated' }

    const { error } = await supabase
      .from('subscription')
      .update({ sub: '', is_active: false })
      .eq('id', user.id)

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('subscribeUser', error)
    return { success: false, message: 'Unknow error' }
  }
}
