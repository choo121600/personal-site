import type { Metadata } from 'next'
import { getMapPlaces } from '@/lib/map-places'
import { PlacesMap } from '@/components/PlacesMap'
import { getLocale } from '@/lib/locale'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    title: locale === 'ko' ? '지도 - Yeonguk Choo' : 'Map - Yeonguk Choo',
    description:
      locale === 'ko'
        ? '블로그 글에 남긴 장소들'
        : 'Places mentioned in blog posts.',
  }
}

export default async function MapPage() {
  const [places, locale] = await Promise.all([getMapPlaces(), getLocale()])

  return (
    <main className="mt-24 space-y-6 pb-20">
      <h1 className="text-2xl font-semibold">
        {locale === 'ko' ? '지도' : 'Map'}
      </h1>
      {places.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          {locale === 'ko'
            ? '아직 지도에 표시할 장소가 없습니다.'
            : 'No places to show on the map yet.'}
        </p>
      ) : (
        <PlacesMap places={places} />
      )}
    </main>
  )
}
