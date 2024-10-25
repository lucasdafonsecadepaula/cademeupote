import { DEFAULT_URL_WEBPUSH } from '@/config'
import {
  getNewestNotificationByItemId,
  getSubscriptionsByArrayIds,
  getUnReturnedBorrowedItems,
} from '@/lib/supabase/queries'
import {
  IBorrowedItemSchema,
  INotification,
  ISubscriptionWithDeviceSchema,
} from '@/lib/supabase/schemas'
import { ChangeType } from '@/utils/changeType'
import { checkIfWasCreatedAt3DaysAgo } from '@/utils/checkIfWasCreatedAt3DaysAgo'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  DEFAULT_URL_WEBPUSH,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export const revalidate = 0

export async function GET(request: NextRequest): Promise<void | Response> {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('CRON JOB UNAUTHORIZATED TO RUN')
    return Response.json({
      success: false,
      message: `unauthorizated`,
    })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  )

  const { data: itemsUnfiltered, error: itemsError } =
    await getUnReturnedBorrowedItems(supabaseAdmin)

  if (itemsError) {
    console.error('getUnReturnedBorrowedItems: ', itemsError)
    return Response.json({
      success: false,
      message: `${itemsError.message}`,
    })
  }

  const items = itemsUnfiltered.filter((item) => !!item.sent_to) as ChangeType<
    IBorrowedItemSchema,
    { sent_to: string }
  >[]

  const itemIds = items.map((item) => item.id)
  const notifications: INotification[] = []

  for (const id of itemIds) {
    const [notification, error] = await getNewestNotificationByItemId(
      supabaseAdmin,
      id,
    )
    if (error) console.log('getNewestNotificationByItemId: ', error)
    if (notification) notifications.push(notification)
  }

  const newestNotifications: Record<string, INotification> = {}
  notifications.forEach((notification) => {
    newestNotifications[notification.item_id] = notification
  })

  const itemsNeedingNotification = items.filter((item) => {
    const newestNotification = newestNotifications[item.id]
    const createdAt = newestNotification
      ? newestNotification.created_at
      : item.created_at

    return checkIfWasCreatedAt3DaysAgo(createdAt)
  })

  const userIdsNeedingNotification = itemsNeedingNotification.map(
    (item) => item.sent_to,
  )

  if (userIdsNeedingNotification.length === 0) {
    return Response.json({
      success: true,
      message: 'without seding notification',
    })
  }

  const [subscriptions, subscriptionsError] = await getSubscriptionsByArrayIds(
    supabaseAdmin,
    userIdsNeedingNotification,
  )

  if (subscriptionsError) {
    console.error('getSubscriptionsByArrayIds: ', subscriptionsError)
    return Response.json({
      success: false,
      message: `${subscriptionsError.message}`,
    })
  }

  const subscriptionsMapById: Record<string, ISubscriptionWithDeviceSchema> = {}
  subscriptions.forEach((subscription) => {
    subscriptionsMapById[subscription.id] = subscription
  })

  for (const itemNeedingNotification of itemsNeedingNotification) {
    const { sub } = subscriptionsMapById[itemNeedingNotification.sent_to]

    try {
      const title = 'Potes também sentem saudades! 🥺'
      const body = `Acho que o(a) ${itemNeedingNotification.name} já está com saudades de casa...`
      await webpush.sendNotification(
        sub,
        JSON.stringify({
          title,
          body,
          icon: '/images/android-chrome-192x192.png',
        }),
      )
      await supabaseAdmin.from('notifications').insert({
        title,
        body,
        item_id: itemNeedingNotification.id,
        is_automatic: true,
      })
    } catch (error) {
      console.error(
        `Failed to send notification to ${itemNeedingNotification.sent_to}:`,
        error,
      )
    }
  }

  return Response.json({
    success: true,
    message: `uses notifyed ${userIdsNeedingNotification.join(', ')}`,
  })
}
