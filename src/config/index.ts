export const BUCKET_NAME = 'borrowed-items'

export const DEFAULT_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const DEFAULT_URL_WEBPUSH = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'mailto:example@yourdomain.org'
