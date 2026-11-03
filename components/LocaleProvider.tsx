'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type Locale = 'ko' | 'en'

const LocaleContext = createContext<Locale | null>(null)

function getPathLocale(pathname: string | null, locale: Locale): Locale {
  if (pathname === '/resume/ko' || pathname?.startsWith('/resume/ko/')) {
    return 'ko'
  }

  if (pathname === '/resume' || pathname?.startsWith('/resume/')) {
    return 'en'
  }

  return locale
}

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const pathname = usePathname()
  const currentLocale = getPathLocale(pathname, locale)

  useEffect(() => {
    document.documentElement.lang = currentLocale
  }, [currentLocale])

  return (
    <LocaleContext.Provider value={currentLocale}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext)
  if (!locale) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return locale
}
