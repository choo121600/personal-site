import Link from 'next/link'
import {
  TALK_CATEGORIES,
  formatTalkDate,
  talkCategoryLabel,
  type TalkCategory,
  type TalkMetadata,
} from '@/lib/talk-types'
import type { Locale } from '@/lib/resume-types'

// 전체 + 발표가 있는 카테고리만 보여준다
export function TalkCategoryNav({
  talks,
  current,
  locale,
}: {
  talks: TalkMetadata[]
  current?: TalkCategory
  locale: Locale
}) {
  const counts = new Map<TalkCategory, number>()
  for (const talk of talks) {
    if (talk.category) {
      counts.set(talk.category, (counts.get(talk.category) ?? 0) + 1)
    }
  }
  const items = [
    {
      href: '/talks',
      label: locale === 'ko' ? '전체' : 'All',
      count: talks.length,
      active: !current,
    },
    ...TALK_CATEGORIES.filter((category) => counts.has(category.slug)).map(
      (category) => ({
        href: `/talks/category/${category.slug}`,
        label: talkCategoryLabel(category.slug, locale),
        count: counts.get(category.slug)!,
        active: current === category.slug,
      }),
    ),
  ]

  return (
    <nav aria-label={locale === 'ko' ? '카테고리' : 'Categories'}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none aria-[current=page]:bg-zinc-900 aria-[current=page]:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 dark:aria-[current=page]:bg-zinc-100 dark:aria-[current=page]:text-zinc-900"
            >
              {item.label}
              <span className="text-xs tabular-nums opacity-60">
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function groupByYear(talks: TalkMetadata[]) {
  const groups = new Map<string, TalkMetadata[]>()
  for (const talk of talks) {
    const year = talk.date.slice(0, 4)
    groups.set(year, [...(groups.get(year) ?? []), talk])
  }
  return [...groups.entries()]
}

export function TalkList({
  talks,
  locale,
}: {
  talks: TalkMetadata[]
  locale: Locale
}) {
  if (talks.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        {locale === 'ko' ? '아직 발표가 없습니다.' : 'No talks yet.'}
      </p>
    )
  }

  return groupByYear(talks).map(([year, items]) => (
    <section key={year} className="space-y-3">
      <h2 className="text-sm font-medium text-zinc-400 tabular-nums dark:text-zinc-500">
        {year}
      </h2>
      <div className="space-y-3">
        {items.map((talk) => (
          <Link
            key={talk.slug}
            href={`/talks/${talk.slug}`}
            className="block rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base leading-snug font-medium sm:text-lg">
                {locale === 'en' ? (talk.titleEn ?? talk.title) : talk.title}
              </h3>
              <span className="shrink-0 text-sm text-zinc-400 tabular-nums dark:text-zinc-500">
                {formatTalkDate(talk.date, locale)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {locale === 'en' ? (talk.eventEn ?? talk.event) : talk.event}
              {talk.type === 'workshop' &&
                ` · ${locale === 'ko' ? '워크숍' : 'Workshop'}`}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {locale === 'ko'
                ? (talk.descriptionKo ?? talk.description)
                : talk.description}
            </p>
            {talk.category && (
              <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                {talkCategoryLabel(talk.category, locale)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  ))
}
