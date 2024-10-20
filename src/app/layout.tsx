import { Poppins, Roboto } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const robotoFont = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'CadêMeuPote?',
  description: 'O melhor jeito para lembrar alguem a devolver o seus potes!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body
        className={`${poppinsFont.variable} ${robotoFont.variable} antialiased font-[family-name:var(--font-poppins)]`}
      >
        {children}
      </body>
    </html>
  )
}
