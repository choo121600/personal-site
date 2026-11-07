'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import type { Map as MapLibreMap, Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useLocale } from '@/components/LocaleProvider'

// OpenFreeMap: OSM 기반 벡터 타일. 키/요금 없음, 저작자 표시는 지도 우측 하단에 자동으로 붙는다.
const STYLE = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
}
const KOREAN_MAP_LOCALE: Record<string, string> = {
  'AttributionControl.ToggleAttribution': '지도 출처 표시 전환',
  'AttributionControl.MapFeedback': '지도에 의견 보내기',
  'FullscreenControl.Enter': '전체 화면으로 보기',
  'FullscreenControl.Exit': '전체 화면 종료',
  'GeolocateControl.FindMyLocation': '내 위치 찾기',
  'GeolocateControl.LocationNotAvailable': '현재 위치를 사용할 수 없습니다',
  'LogoControl.Title': 'MapLibre 로고',
  'Map.Title': '지도',
  'Marker.Title': '지도 마커',
  'NavigationControl.ResetBearing':
    '지도를 드래그해 회전하고 클릭해 북쪽 방향으로 되돌리기',
  'NavigationControl.ZoomIn': '확대',
  'NavigationControl.ZoomOut': '축소',
  'Popup.Close': '팝업 닫기',
  'ScaleControl.Feet': '피트',
  'ScaleControl.Meters': '미터',
  'ScaleControl.Kilometers': '킬로미터',
  'ScaleControl.Miles': '마일',
  'ScaleControl.NauticalMiles': '해리',
  'GlobeControl.Enable': '지구본 보기로 전환',
  'GlobeControl.Disable': '지구본 보기 끄기',
  'TerrainControl.Enable': '지형 보기 켜기',
  'TerrainControl.Disable': '지형 보기 끄기',
  'CooperativeGesturesHandler.WindowsHelpText':
    'Ctrl 키를 누른 채 스크롤하여 지도를 확대/축소하세요',
  'CooperativeGesturesHandler.MacHelpText':
    '⌘ 키를 누른 채 스크롤하여 지도를 확대/축소하세요',
  'CooperativeGesturesHandler.MobileHelpText':
    '두 손가락으로 지도를 이동하세요',
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
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef(new Map<string, Marker>())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId
  const { resolvedTheme } = useTheme()
  const theme: keyof typeof STYLE = resolvedTheme === 'dark' ? 'dark' : 'light'
  const themeRef = useRef(theme)
  themeRef.current = theme

  // 장소나 언어가 바뀌면 지도와 마커를 다시 만든다.
  useEffect(() => {
    const container = containerRef.current
    if (!container || places.length === 0) return
    let cancelled = false
    const markers = markersRef.current

    import('maplibre-gl').then(
      ({ Map, Marker, LngLatBounds, setWorkerUrl }) => {
        if (cancelled) return
        // maplibre 6은 워커를 번들 청크 옆의 별도 파일에서 찾는데, Next 빌드에는 그 파일이
        // 없다. new URL(..., import.meta.url)로 지정해 webpack이 워커 파일을 함께 내보내게 한다.
        setWorkerUrl(
          new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url)
            .href,
        )
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
          fitBoundsOptions: {
            padding: FIT_PADDING,
            maxZoom: SINGLE_PLACE_ZOOM,
          },
          cooperativeGestures: true,
          attributionControl: { compact: true },
          locale: locale === 'ko' ? KOREAN_MAP_LOCALE : undefined,
        })
        mapRef.current = map

        for (const place of places) {
          const element = document.createElement('button')
          element.type = 'button'
          element.className = MARKER_CLASS
          element.setAttribute(
            'aria-label',
            `${locale === 'ko' ? '지도 위치' : 'Map location'}: ${place.name}`,
          )
          element.title = place.name
          element.setAttribute(
            'aria-pressed',
            String(place.id === selectedIdRef.current),
          )
          const dot = document.createElement('span')
          dot.className = MARKER_DOT_CLASS
          element.append(dot)
          element.addEventListener('click', (event) => {
            event.stopPropagation()
            onSelectRef.current?.(place.id)
          })
          markers.set(
            place.id,
            new Marker({ element })
              .setLngLat([place.lng, place.lat])
              .addTo(map),
          )
        }
        const selected = places.find(
          (place) => place.id === selectedIdRef.current,
        )
        if (selected) {
          map.jumpTo({
            center: [selected.lng, selected.lat],
            zoom: Math.max(map.getZoom(), SELECTED_ZOOM),
          })
        }
      },
    )

    return () => {
      cancelled = true
      markers.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [places, locale])

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
