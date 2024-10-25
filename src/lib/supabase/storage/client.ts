import imageCompression from 'browser-image-compression'
import { v4 as uuidv4 } from 'uuid'
import { SupabaseClient } from '@supabase/supabase-js'
import { BUCKET_NAME } from '@/config'

type UploadProps = {
  file: File
  userId: string
  itemId: string
}

export const uploadImage = async (
  supabase: SupabaseClient,
  { file, userId, itemId }: UploadProps,
) => {
  const fileName = file.name
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1)
  const newFileName = `${uuidv4()}.${fileExtension}`
  const path = `${userId}/${itemId}/${newFileName}`

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    })
  } catch (error) {
    return [null, error] as const
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      upsert: true,
    })
  if (error) return [null, error] as const

  return [data, null] as const
}
