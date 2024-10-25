'use server'

import {
  getUser,
  subscribeQuery,
  unsubscribeQuery,
} from '@/lib/supabase/queries'
import { DeviceSubscriptionSchema } from '@/lib/supabase/schemas'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function subscribeUser(body: PushSubscription) {
  const { data: sub, error: errorParseSub } =
    DeviceSubscriptionSchema.safeParse(body)
  if (errorParseSub) return { success: false, message: errorParseSub.message }

  const supabase = createSupabaseServer()
  const user = await getUser(supabase)
  if (!user) return { success: false, message: 'Not Authenticated' }

  const { error } = await subscribeQuery(supabase, {
    user,
    sub: JSON.stringify(sub),
  })
  if (error) return { success: false, message: error.message }

  return { success: true }
}

export async function unsubscribeUser() {
  const supabase = createSupabaseServer()
  const user = await getUser(supabase)
  if (!user) return { success: false, message: 'Not Authenticated' }

  const { error } = await unsubscribeQuery(supabase, {
    user,
  })
  if (error) return { success: false, message: error.message }

  return { success: true }
}
