'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from '@/components/LocaleProvider'

export function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const isResumePath =
    pathname === '/resume' || pathname?.startsWith('/resume/')

  function selectLocale(nextLocale: 'ko' | 'en') {
    document.cookie = `site-locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()

    if (isResumePath) {
      router.push(nextLocale === 'ko' ? '/resume/ko' : '/resume')
    }
  }

  return (
    <header className="mb-8 flex items-center justify-between gap-3">
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          Yeonguk Choo
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          {locale === 'ko' ? '탐험가' : 'Explorer'}
        </TextEffect>
      </div>
      <div
        aria-label={locale === 'ko' ? '언어 선택' : 'Language selection'}
        className="flex shrink-0 items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800"
        role="group"
      >
        <button
          aria-pressed={locale === 'ko'}
          className={`rounded-md px-2 py-1 text-xs whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${
            locale === 'ko'
              ? 'bg-white font-medium text-zinc-950 dark:bg-zinc-700 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'
          }`}
          onClick={() => selectLocale('ko')}
          type="button"
        >
          한국어
        </button>
        <button
          aria-pressed={locale === 'en'}
          className={`rounded-md px-2 py-1 text-xs whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${
            locale === 'en'
              ? 'bg-white font-medium text-zinc-950 dark:bg-zinc-700 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'
          }`}
          onClick={() => selectLocale('en')}
          type="button"
        >
          English
        </button>
      </div>
    </header>
  )
}
