import { Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { DEFAULT_URL } from '@/config'

const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_URL),
  title: 'CadêMeuPote?',
  description:
    'A maneira mais divertida e eficiente de lembrar seus amigos ou familiares a devolver seus potes!',
  keywords: 'Empréstimo, pote, aplicativo para mães',
  openGraph: {
    images: '/images/og-image.png',
  },
  twitter: {
    images: '/images/twitter-image.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body
        className={`${poppinsFont.variable} antialiased font-[family-name:var(--font-poppins)]`}
      >
        {children}
      </body>
    </html>
  )
}
