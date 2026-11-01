import type { Metadata } from 'next'
import { getMapPlaces } from '@/lib/map-places'
import { PlacesMap } from '@/components/PlacesMap'

export const metadata: Metadata = {
  title: 'Map - Yeonguk Choo',
  description: '블로그 글에 남긴 장소들',
}

export default async function MapPage() {
  const places = await getMapPlaces()

  return (
    <main className="mt-24 space-y-6 pb-20">
      <h1 className="text-2xl font-semibold">Map</h1>
      {places.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          아직 지도에 표시할 장소가 없습니다.
        </p>
      ) : (
        <PlacesMap places={places} />
      )}
    </main>
  )
}
