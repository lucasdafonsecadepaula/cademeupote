import type { SupabaseClient, User } from '@supabase/supabase-js'
import {
  BorrowedItemsArraySchema,
  BorrowedItemSchema,
  NotificationSchema,
  SubscriptionsWithDevicesArraySchema,
} from './schemas'
import { BUCKET_NAME } from '@/config'
// import { cache } from 'react'

export const getUser = async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

type UpsertSubscriptionProps = {
  user: User
  sub: string
}

export const subscribeQuery = async (
  supabase: SupabaseClient,
  { user, sub }: UpsertSubscriptionProps,
) => {
  const { error } = await supabase
    .from('subscription')
    .upsert({ sub, is_active: true })
    .eq('id', user.id)

  return { error }
}

export const unsubscribeQuery = async (
  supabase: SupabaseClient,
  { user }: { user: User },
) => {
  const { error } = await supabase
    .from('subscription')
    .update({ sub: '', is_active: false })
    .eq('id', user.id)

  return { error }
}

export const getUnReturnedBorrowedItems = async (supabase: SupabaseClient) => {
  const { data: dataNotParsed, error } = await supabase
    .from('borrowed_items')
    .select('*')
    .eq('has_returned', false)

  if (error) return { data: null, error }

  const { data, error: errorParsing } =
    BorrowedItemsArraySchema.safeParse(dataNotParsed)

  if (errorParsing) return { data: null, error: errorParsing }

  return { data, error: null }
}

export const getNewestNotificationByItemId = async (
  supabase: SupabaseClient,
  id: string,
) => {
  const { data: dataNotParsed, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('item_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return [null, error] as const
  if (dataNotParsed === undefined) return [null, null] as const

  const { data, error: errorParsing } =
    NotificationSchema.safeParse(dataNotParsed)

  if (errorParsing) return [null, errorParsing] as const

  return [data, null] as const
}

export const getSubscriptionsByArrayIds = async (
  supabase: SupabaseClient,
  ids: string[],
) => {
  const { data: dataNotParsed, error } = await supabase
    .from('subscription')
    .select('*')
    .in('id', ids)
    .eq('is_active', true)

  if (error) return [null, error] as const

  const partlyParsedData = dataNotParsed.map((e) => ({
    ...e,
    sub: JSON.parse(e.sub),
  }))

  const { data, error: errorParsing } =
    SubscriptionsWithDevicesArraySchema.safeParse(partlyParsedData)
  if (errorParsing) return [null, errorParsing] as const

  return [data, null] as const
}

type AcceptBorrowedItemProps = {
  userId: string
  userName: string
  userImageUrl: string
  token: string
}

export const acceptBorrowedItem = async (
  supabase: SupabaseClient,
  { userId, userName, userImageUrl, token }: AcceptBorrowedItemProps,
) => {
  const { error } = await supabase
    .from('borrowed_items')
    .update({
      sent_to: userId,
      borrower_name: userName,
      borrower_image_url: userImageUrl ?? '',
    })
    .eq('id', token)
    .single()
    .setHeader('token', token)

  return [null, error] as const
}

export const getBorrowedItemByToken = async (
  supabase: SupabaseClient,
  token: string,
) => {
  const { data: dataNotParsed, error } = await supabase
    .from('borrowed_items')
    .select('*')
    .eq('id', token)
    .single()
    .setHeader('token', token)
  if (error) return [null, error] as const

  const { data, error: errorParsing } =
    BorrowedItemSchema.safeParse(dataNotParsed)

  if (errorParsing) return [null, errorParsing] as const

  return [data, null]
}

export const getStorageImage = async (
  supabase: SupabaseClient,
  imageName: string,
) => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(imageName, 60 * 60)

  if (error) return [null, error] as const

  return [data.signedUrl, null] as const
}

export const getStorageImagesByName = async (
  supabase: SupabaseClient,
  imagesNames: string[],
) => {
  const signedUrls = await Promise.all(
    imagesNames.map(async (name) => {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(name, 60 * 60)

      if (error) {
        console.error(`getStorageImagesByName ${name}:`, error)
        return null
      }
      return data.signedUrl
    }),
  )

  return [signedUrls, null] as const
}

export const getMyBorrowedItems = async (supabase: SupabaseClient) => {
  const { data: dataNotParsed, error } = await supabase
    .from('borrowed_items')
    .select('*')
    .eq('has_returned', false)
    .order('created_at', { ascending: true })

  if (error) return [null, error] as const

  const { data, error: errorParsing } =
    BorrowedItemsArraySchema.safeParse(dataNotParsed)

  if (errorParsing) return [null, errorParsing] as const

  return [data, null] as const
}

type InsertBorrowedItemProps = {
  name: string
  description: string
  isPublic: boolean
  lenderName: string
  lenderImageUrl: string
}

export const insertBorrowedItem = async (
  supabase: SupabaseClient,
  body: InsertBorrowedItemProps,
) => {
  const { data: dataNotParsed, error } = await supabase
    .from('borrowed_items')
    .insert({
      name: body.name,
      description: body.description,
      is_public: body.isPublic,
      lender_name: body.lenderName,
      lender_image_url: body.lenderImageUrl,
    })
    .select()
    .single()

  if (error) return [null, error] as const

  const { data, error: errorParsing } =
    BorrowedItemSchema.safeParse(dataNotParsed)

  if (errorParsing) return [null, errorParsing] as const

  return [data, null] as const
}

export const markAsDeliveredQuery = async (
  supabase: SupabaseClient,
  id: string,
) => {
  const { error } = await supabase
    .from('borrowed_items')
    .update({
      has_returned: true,
    })
    .eq('id', id)
    .single()

  return { error }
}
