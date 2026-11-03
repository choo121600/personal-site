import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllTalks, formatTalkDate, type TalkMetadata } from '@/lib/talks'
import { getLocale } from '@/lib/locale'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return locale === 'ko'
    ? {
        title: '발표 - Yeonguk Choo',
        description: '추영욱의 발표 및 워크숍.',
      }
    : {
        title: 'Talks - Yeonguk Choo',
        description: 'Talks and workshops by Yeonguk Choo.',
      }
}

function groupByYear(talks: TalkMetadata[]) {
  const groups = new Map<string, TalkMetadata[]>()
  for (const talk of talks) {
    const year = talk.date.slice(0, 4)
    groups.set(year, [...(groups.get(year) ?? []), talk])
  }
  return [...groups.entries()]
}

export default async function TalksPage() {
  const locale = await getLocale()
  const talks = getAllTalks()

  return (
    <main className="mt-24 space-y-10 pb-20">
      <h1 className="text-2xl font-semibold">
        {locale === 'ko' ? '발표' : 'Talks'}
      </h1>
      {talks.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          {locale === 'ko' ? '아직 발표가 없습니다.' : 'No talks yet.'}
        </p>
      ) : (
        groupByYear(talks).map(([year, items]) => (
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
                      {locale === 'en'
                        ? (talk.titleEn ?? talk.title)
                        : talk.title}
                    </h3>
                    <span className="shrink-0 text-sm text-zinc-400 tabular-nums dark:text-zinc-500">
                      {formatTalkDate(talk.date, locale)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    {locale === 'en'
                      ? (talk.eventEn ?? talk.event)
                      : talk.event}
                    {talk.type === 'workshop' &&
                      ` · ${locale === 'ko' ? '워크숍' : 'Workshop'}`}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {locale === 'ko'
                      ? (talk.descriptionKo ?? talk.description)
                      : talk.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  )
}
