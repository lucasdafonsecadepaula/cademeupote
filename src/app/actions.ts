'use server'

import { createSupabaseServer } from '@/lib/supabase/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  // 'http://localhost:3000',
  'mailto:example@yourdomain.org',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

// const subscription: PushSubscription | null = null

type CustomSubscribe = {
  endpoint: string
  keys: { auth: string; p256dh: string }
  expirationTime: number | null | undefined
}

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

export async function sendNotification(message: string) {
  try {
    const supabase = createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not Authenticated' }

    const { data: dataQuery, error } = await supabase
      .from('subscription')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return { success: false, message: error.message }
    }

    const data = {
      ...dataQuery,
      sub: JSON.parse(dataQuery.sub),
    } as {
      id: string
      created_at: string
      sub: CustomSubscribe
      is_active: boolean
    } | null

    if (!data || !data.is_active) {
      return { success: false, message: 'Not subscribe' }
    }

    await webpush.sendNotification(
      data.sub,
      JSON.stringify({
        title: 'VEM DO BACKEND',
        body: message,
        icon: '/images/android-chrome-192x192.png',
      }),
    )

    return { success: true }
  } catch (error) {
    console.error('subscribeUser', error)
    return { success: false, message: 'Unknow error' }
  }
}
