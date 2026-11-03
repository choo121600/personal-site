'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { XIcon } from 'lucide-react'
import { MapView } from './MapView'
import type { MapPlace } from '@/lib/map-places'
import { useLocale } from '@/components/LocaleProvider'

function formatDate(date: string, locale: 'ko' | 'en') {
  return date
    ? new Date(date).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
}

function PlacePosts({
  place,
  locale,
}: {
  place: MapPlace
  locale: 'ko' | 'en'
}) {
  return (
    <ul className="space-y-1">
      {place.posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-100"
          >
            {post.title}
          </Link>
          {post.date && (
            <span className="ml-2 text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
              {formatDate(post.date, locale)}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export function PlacesMap({ places }: { places: MapPlace[] }) {
  const locale = useLocale()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = places.find((place) => place.id === selectedId)
  const mapFrameRef = useRef<HTMLDivElement>(null)

  // 목록에서 고르면 지도가 보이도록 스크롤한다
  const selectFromList = (id: string) => {
    setSelectedId(id)
    mapFrameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="space-y-8">
      <div
        ref={mapFrameRef}
        className="relative h-[70vh] min-h-96 w-full overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/60 ring-inset dark:bg-zinc-900 dark:ring-zinc-800/60"
      >
        <MapView
          places={places}
          selectedId={selectedId}
          onSelect={setSelectedId}
          className="h-full w-full"
        />
        {selected && (
          <div className="absolute top-3 left-3 z-10 w-72 max-w-[calc(100%-1.5rem)] rounded-xl bg-white p-4 text-sm ring-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)] ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                {selected.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label={locale === 'ko' ? '닫기' : 'Close'}
                className="-m-1 rounded p-1 text-zinc-500 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:hover:text-zinc-100"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <PlacePosts place={selected} locale={locale} />
          </div>
        )}
      </div>

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {places.map((place) => (
          <li key={place.id} className="py-3">
            <button
              type="button"
              onClick={() => selectFromList(place.id)}
              aria-pressed={place.id === selectedId}
              className="rounded-sm text-left font-medium text-zinc-900 hover:underline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none aria-pressed:underline dark:text-zinc-100"
            >
              {place.name}
            </button>
            <div className="mt-1 text-sm">
              <PlacePosts place={place} locale={locale} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
