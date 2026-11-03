import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import { LocaleProvider } from '@/components/LocaleProvider'
import { getLocale } from '@/lib/locale'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    title: locale === 'ko' ? 'Yeonguk Choo | 개인 웹사이트' : 'Yeonguk Choo',
    description:
      locale === 'ko'
        ? 'Yeonguk Choo의 개인 웹사이트. 탐험가.'
        : "Yeonguk Choo's personal website. Explorer.",
  }
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <LocaleProvider locale={locale}>
            <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
              <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
                <Header />
                {children}
                <Footer />
              </div>
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
