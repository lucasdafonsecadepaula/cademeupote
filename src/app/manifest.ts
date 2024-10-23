import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CadêMeuPote?',
    short_name: 'CadêMeuPote?',
    id: 'cademeupote',
    description: 'O melhor jeito para lembrar alguem a devolver o seus potes!',
    start_url: '/',
    display: 'standalone',
    lang: 'pt-BR',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#FFA724',
    icons: [
      {
        src: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/images/og.png',
        sizes: '716x441',
        type: 'image/png',
      },
    ],
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://cademeupote.vercel.app/manifest.webmanifest',
      },
    ],
  }
}
