import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllTalks, getTalkBySlug, formatTalkDate } from '@/lib/talks'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { expandMapLinks } from '@/lib/map-links'
import { YouTubeEmbed, extractYouTubeId } from '@/components/YouTubeEmbed'

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
  const talk = getTalkBySlug(slug)
  if (!talk) return { title: 'Talk Not Found' }

  return {
    title: `${talk.title} - Yeonguk Choo`,
    description: talk.description,
  }
}

export default async function TalkPage({ params }: PageProps) {
  const { slug } = await params
  const talk = getTalkBySlug(slug)
  if (!talk) notFound()

  const videoId = talk.video ? extractYouTubeId(talk.video) : null
  const links = [
    { label: 'Event page', href: talk.eventUrl },
    { label: 'Slides', href: talk.slides },
    // 유튜브가 아닌 영상은 임베드 대신 링크로 보여준다
    { label: 'Video', href: videoId ? undefined : talk.video },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  )

  return (
    <main className="mt-24 pb-20">
      <Link
        href="/talks"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← All talks
      </Link>
      <header className="mt-6 mb-8 space-y-2">
        <h1 className="text-2xl font-semibold text-balance">{talk.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {talk.event}
          {talk.type === 'workshop' && ' · Workshop'}
        </p>
        <time className="block text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
          {formatTalkDate(talk.date, 'en', true)}
        </time>
      </header>

      <p className="text-zinc-700 dark:text-zinc-300">{talk.description}</p>

      {videoId && <YouTubeEmbed videoId={videoId} title={talk.title} />}

      {links.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-3">
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
      )}

      {talk.content && (
        <MarkdownRenderer
          content={await expandMapLinks(talk.content)}
          className="mt-10"
        />
      )}
    </main>
  )
}
