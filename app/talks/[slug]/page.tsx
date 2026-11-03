import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllTalks, getTalkBySlug, formatTalkDate } from '@/lib/talks'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { expandMapLinks } from '@/lib/map-links'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { extractYouTubeId } from '@/lib/youtube'
import { getLocale } from '@/lib/locale'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllTalks().map((talk) => ({ slug: talk.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const talk = getTalkBySlug(slug)
  if (!talk) {
    return {
      title: locale === 'ko' ? '발표를 찾을 수 없습니다' : 'Talk Not Found',
    }
  }

  const title = locale === 'en' ? (talk.titleEn ?? talk.title) : talk.title
  const description =
    locale === 'ko'
      ? (talk.descriptionKo ?? talk.description)
      : talk.description

  return {
    title: `${title} - Yeonguk Choo`,
    description,
  }
}

export default async function TalkPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const talk = getTalkBySlug(slug)
  if (!talk) notFound()

  const title = locale === 'en' ? (talk.titleEn ?? talk.title) : talk.title
  const event = locale === 'en' ? (talk.eventEn ?? talk.event) : talk.event
  const description =
    locale === 'ko'
      ? (talk.descriptionKo ?? talk.description)
      : talk.description
  const content =
    locale === 'en' ? (talk.contentEn ?? talk.content) : talk.content
  const videoId = talk.video ? extractYouTubeId(talk.video) : null
  const links = [
    {
      label: locale === 'ko' ? '행사 페이지' : 'Event page',
      href: talk.eventUrl,
    },
    { label: locale === 'ko' ? '발표 자료' : 'Slides', href: talk.slides },
    // 유튜브가 아닌 영상은 임베드 대신 링크로 보여준다
    {
      label: locale === 'ko' ? '영상' : 'Video',
      href: videoId ? undefined : talk.video,
    },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  )

  return (
    <main className="mt-24 pb-20">
      <Link
        href="/talks"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        {locale === 'ko' ? '← 전체 발표' : '← All talks'}
      </Link>
      <header className="mt-6 mb-8 space-y-2">
        <h1 className="text-2xl font-semibold text-balance">{title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {event}
          {talk.type === 'workshop' &&
            ` · ${locale === 'ko' ? '워크숍' : 'Workshop'}`}
        </p>
        <time className="block text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
          {formatTalkDate(talk.date, locale, true)}
        </time>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {talk.language
            ? locale === 'ko'
              ? `발표 언어: ${talk.language === 'ko' ? '한국어' : '영어'}`
              : `Presentation language: ${talk.language === 'ko' ? 'Korean' : 'English'}`
            : locale === 'ko'
              ? '발표 언어 미기재'
              : 'Presentation language not specified'}
        </p>
      </header>

      <p className="text-zinc-700 dark:text-zinc-300">{description}</p>

      {videoId && <YouTubeEmbed videoId={videoId} title={title} />}

      {links.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {locale === 'ko' ? '원본 자료' : 'Original materials'}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-900 transition-colors hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {content && (
        <MarkdownRenderer
          content={await expandMapLinks(content)}
          className="mt-10"
        />
      )}
    </main>
  )
}
