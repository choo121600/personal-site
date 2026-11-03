'use client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { TextLoop } from '@/components/ui/text-loop'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useLocale } from '@/components/LocaleProvider'

const THEMES_OPTIONS = [
  {
    label: { en: 'Light', ko: '라이트' },
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: { en: 'Dark', ko: '다크' },
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: { en: 'System', ko: '시스템' },
    id: 'system',
    icon: <MonitorIcon className="h-4 w-4" />,
  },
]

function ThemeSwitch({ locale }: { locale: 'ko' | 'en' }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        setTheme(id as string)
      }}
    >
      {THEMES_OPTIONS.map((theme) => {
        return (
          <button
            key={theme.id}
            className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
            type="button"
            aria-label={
              locale === 'ko'
                ? `${theme.label.ko} 테마로 전환`
                : `Switch to ${theme.label.en} theme`
            }
            data-id={theme.id}
          >
            {theme.icon}
          </button>
        )
      })}
    </AnimatedBackground>
  )
}

export function Footer() {
  const locale = useLocale()

  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <a href="https://github.com/choo121600" target="_blank">
          <TextLoop className="text-xs text-zinc-500">
            <span>© 2025 Yeonguk Choo.</span>
            <span>
              {locale === 'ko' ? '나의 개인 웹사이트' : 'My Personal Website'}
            </span>
          </TextLoop>
        </a>
        <div className="text-xs text-zinc-400">
          <ThemeSwitch locale={locale} />
        </div>
      </div>
    </footer>
  )
}
