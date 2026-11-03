'use client'

// 본문의 지도 링크/임베드 코드(구글/네이버) → OSM 지도.
// 구글/네이버는 좌표를 얻는 출처로만 쓰고, 지도는 MapView(OpenFreeMap)로 그린다.

import { useMemo } from 'react'
import { MapView } from './MapView'
import type { PlaceRef } from '@/lib/map-coords'
import { useLocale } from '@/components/LocaleProvider'

const SOURCE_LINK_LABEL: Record<
  PlaceRef['source'],
  Record<'ko' | 'en', string>
> = {
  google: { ko: 'Google 지도에서 보기', en: 'View on Google Maps' },
  naver: { ko: '네이버 지도에서 보기', en: 'View on Naver Map' },
}

interface MapEmbedProps {
  place: PlaceRef
  // 원본 지도 링크. 있으면 캡션에 출처 지도 링크로 건다
  href?: string
  title?: string
}

export function MapEmbed({ place, href, title }: MapEmbedProps) {
  const locale = useLocale()
  const label = title || place.name || (locale === 'ko' ? '지도' : 'Map')
  const places = useMemo(
    () => [{ id: 'place', lat: place.lat, lng: place.lng, name: label }],
    [place.lat, place.lng, label],
  )

  return (
    <figure className="not-prose my-6">
      <MapView
        places={places}
        className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/60 ring-inset sm:aspect-video dark:bg-zinc-900 dark:ring-zinc-800/60"
      />
      <figcaption className="mt-2 flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="truncate">{label}</span>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-zinc-900 dark:decoration-zinc-600 dark:hover:text-zinc-100"
          >
            {SOURCE_LINK_LABEL[place.source][locale]} ↗
          </a>
        )}
      </figcaption>
    </figure>
  )
}
