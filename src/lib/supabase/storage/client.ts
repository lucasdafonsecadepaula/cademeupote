import imageCompression from 'browser-image-compression'
import { createSupabaseClient } from '../client'
import { v4 as uuidv4 } from 'uuid'

function getStorage() {
  const { storage } = createSupabaseClient()
  return storage
}

type UploadProps = {
  file: File
  bucket: string
  folder?: string
}
export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1)
  const imageId = uuidv4()
  const path = `${folder ? folder + '/' : ''}${imageId}.${fileExtension}`

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    })
  } catch (error) {
    console.error(error)
    return { imageUrl: '', error: 'Image compression failed' }
  }

  const storage = getStorage()

  const { data, error } = await storage.from(bucket).upload(path, file)

  if (error) {
    return { imageUrl: '', error: 'Image upload failed' }
  }

  return { data, error: '' }
}

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split('/storage/v1/object/public/')[1]
  const firstSlashIndex = bucketAndPathString.indexOf('/')

  const bucket = bucketAndPathString.slice(0, firstSlashIndex)
  const path = bucketAndPathString.slice(firstSlashIndex + 1)

  const storage = getStorage()

  const { data, error } = await storage.from(bucket).remove([path])

  return { data, error }
}