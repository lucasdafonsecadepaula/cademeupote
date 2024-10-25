import { z } from 'zod'

export const BorrowedItemSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  name: z.string(),
  description: z.string().optional(),
  created_by: z.string(),
  sent_to: z.string().nullable().optional(),
  is_public: z.boolean(),
  has_returned: z.boolean(),
  image_name: z.string().nullable().optional(),
  lender_name: z.string(),
  lender_image_url: z.string(),
  borrower_name: z.string().nullable().optional(),
  borrower_image_url: z.string().nullable().optional(),
})

export type IBorrowedItemSchema = z.infer<typeof BorrowedItemSchema>

export const BorrowedItemsArraySchema = z.array(BorrowedItemSchema)

export type IBorrowedItemsArraySchema = z.infer<typeof BorrowedItemsArraySchema>

export const NotificationSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  body: z.string(),
  item_id: z.string(),
  is_automatic: z.boolean(),
})

export type INotification = z.infer<typeof NotificationSchema>

export const SubscriptionSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  sub: z.string(),
  is_active: z.boolean(),
})

export const SubscriptionsArraySchema = z.array(SubscriptionSchema)

export const DeviceSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

export const SubscriptionWithDeviceSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  sub: DeviceSubscriptionSchema,
  is_active: z.boolean(),
})

export type ISubscriptionWithDeviceSchema = z.infer<
  typeof SubscriptionWithDeviceSchema
>

export const SubscriptionsWithDevicesArraySchema = z.array(
  SubscriptionWithDeviceSchema,
)
