'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import type { Map as MapLibreMap, Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// OpenFreeMap: OSM 기반 벡터 타일. 키/요금 없음, 저작자 표시는 지도 우측 하단에 자동으로 붙는다.
const STYLE = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
}
const SINGLE_PLACE_ZOOM = 15
const FIT_PADDING = 56
// 목록/마커로 장소를 고르면 최소 이 줌까지 확대한다
const SELECTED_ZOOM = 14

export interface MapViewPlace {
  id: string
  lat: number
  lng: number
  name: string
}

interface MapViewProps {
  places: MapViewPlace[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  className?: string
}

// MapLibre는 마커 위치를 요소의 transform으로 잡는다. 같은 요소에 scale을 주면
// 위치(translate)까지 함께 커지므로 크기 변화는 안쪽 점(span)에만 준다.
const MARKER_CLASS =
  'group block cursor-pointer rounded-full p-1 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none'
const MARKER_DOT_CLASS =
  'block size-4 rounded-full border-2 border-white bg-zinc-600 shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-[scale,background-color] group-aria-pressed:scale-125 group-aria-pressed:bg-zinc-950'

export function MapView({
  places,
  selectedId,
  onSelect,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef(new Map<string, Marker>())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const { resolvedTheme } = useTheme()
  const theme: keyof typeof STYLE = resolvedTheme === 'dark' ? 'dark' : 'light'
  const themeRef = useRef(theme)
  themeRef.current = theme

  // 지도와 마커 생성 (places가 바뀔 때만 다시 만든다)
  useEffect(() => {
    const container = containerRef.current
    if (!container || places.length === 0) return
    let cancelled = false
    const markers = markersRef.current

    import('maplibre-gl').then(({ Map, Marker, LngLatBounds }) => {
      if (cancelled) return
      const single = places.length === 1
      const map = new Map({
        container,
        style: STYLE[themeRef.current],
        center: single ? [places[0].lng, places[0].lat] : undefined,
        zoom: single ? SINGLE_PLACE_ZOOM : undefined,
        bounds: single
          ? undefined
          : places.reduce(
              (bounds, p) => bounds.extend([p.lng, p.lat]),
              new LngLatBounds(),
            ),
        fitBoundsOptions: { padding: FIT_PADDING, maxZoom: SINGLE_PLACE_ZOOM },
        cooperativeGestures: true,
        attributionControl: { compact: true },
      })
      mapRef.current = map

      for (const place of places) {
        const element = document.createElement('button')
        element.type = 'button'
        element.className = MARKER_CLASS
        element.setAttribute('aria-label', place.name)
        element.title = place.name
        const dot = document.createElement('span')
        dot.className = MARKER_DOT_CLASS
        element.append(dot)
        element.addEventListener('click', (event) => {
          event.stopPropagation()
          onSelectRef.current?.(place.id)
        })
        markers.set(
          place.id,
          new Marker({ element }).setLngLat([place.lng, place.lat]).addTo(map),
        )
      }
    })

    return () => {
      cancelled = true
      markers.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [places])

  // 테마가 바뀌면 스타일만 교체한다 (마커는 DOM이라 유지된다)
  useEffect(() => {
    mapRef.current?.setStyle(STYLE[theme])
  }, [theme])

  // 선택된 장소 강조 + 이동
  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      marker
        .getElement()
        .setAttribute('aria-pressed', String(id === selectedId))
    }
    const place = places.find((p) => p.id === selectedId)
    const map = mapRef.current
    if (place && map) {
      map.easeTo({
        center: [place.lng, place.lat],
        zoom: Math.max(map.getZoom(), SELECTED_ZOOM),
      })
    }
  }, [selectedId, places])

  return <div ref={containerRef} className={className} />
}
