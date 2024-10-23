import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
import { z } from 'zod'

const ItemSchema = z.array(
  z.object({
    id: z.string(),
    sent_to: z.string(),
    created_at: z.string(),
    lender_name: z.string(),
    name: z.string(),
  }),
)

const NotificationSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  body: z.string(),
  item_id: z.string(),
  is_automatic: z.boolean(),
})

const SubscriptionSchema = z.array(
  z.object({
    id: z.string(),
    created_at: z.string(),
    sub: z.string(),
    is_active: z.boolean(),
  }),
)

const PushSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

webpush.setVapidDetails(
  // 'http://localhost:3000',
  'mailto:example@yourdomain.org',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

function checkIfWasCreated3DaysAgo(createdAt: string) {
  const createdDate = new Date(createdAt).getTime()
  const currentDate = new Date().getTime()
  const diffInMs = currentDate - createdDate
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays >= 3
}

export async function POST(request: Request) {
  try {
    const res = await request.json()
    if (res.secret !== 'Pyg999amEsz9dgyLYNyBh72OTVtn7aG1ymvkd11dDSjSK0swwb') {
      throw new Error('')
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { data: itemsNotParsed, error: itemsError } = await supabaseAdmin
      .from('borrowed_items')
      .select('id, sent_to, created_at, lender_name, name')
      .eq('has_returned', false)

    if (itemsError) throw new Error('')

    const items = ItemSchema.parse(itemsNotParsed)
    const itemIds = items.filter((item) => item.sent_to).map((item) => item.id)

    const notifications: z.infer<typeof NotificationSchema>[] = []

    for (const id of itemIds) {
      const { data: notificationNotParsed, error: notificationError } =
        await supabaseAdmin
          .from('notifications')
          .select('*')
          .eq('item_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      if (notificationError) throw new Error(notificationError.message)
      if (notificationNotParsed) {
        const notification = NotificationSchema.parse(notificationNotParsed)
        notifications.push(notification)
      }
    }

    // Create a mapping of the latest notification for each item
    const latestNotifications: Record<
      string,
      z.infer<typeof NotificationSchema>
    > = {}
    notifications.forEach((notification) => {
      latestNotifications[notification.item_id] = notification
    })

    // Collect items that need new notifications
    const itemsNeedingNotification = items.filter((item) => {
      const latestNotification = latestNotifications[item.id]

      // Determine whether a notification exists and check its expiration
      const createdAt = latestNotification
        ? latestNotification.created_at
        : item.created_at

      return checkIfWasCreated3DaysAgo(createdAt)
    })

    const userIdsNeedingNotification = itemsNeedingNotification.map(
      (item) => item.sent_to,
    )

    const { data: subscriptionsNotParsed, error: subscriptionsError } =
      await supabaseAdmin
        .from('subscription')
        .select('*')
        .in('id', userIdsNeedingNotification)

    if (subscriptionsError) {
      return { success: false, message: subscriptionsError.message }
    }

    const subscriptions = SubscriptionSchema.parse(subscriptionsNotParsed)

    const subscriptionsMapById: Record<
      string,
      z.infer<typeof SubscriptionSchema>[number]
    > = {}
    subscriptions.forEach((subscription) => {
      if (!subscriptionsMapById[subscription.id]) {
        subscriptionsMapById[subscription.id] = subscription
      }
    })

    for (const itemNeedingNotification of itemsNeedingNotification) {
      const sub = PushSubscriptionSchema.parse(
        JSON.parse(subscriptionsMapById[itemNeedingNotification.sent_to].sub),
      )

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

    return Response.json({ success: true })
  } catch (error) {
    console.log(error)
    return Response.json({ success: false })
  }
}