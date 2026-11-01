// 지도 링크/임베드 코드(구글/네이버)에서 장소 좌표와 이름을 읽는다 (client-safe).
// 지도는 OSM으로 그리고, 구글/네이버는 좌표를 얻는 출처로만 쓴다.

export interface LatLng {
  lat: number
  lng: number
}

export interface PlaceRef extends LatLng {
  // URL에서 알 수 있는 장소 이름
  name: string | null
  source: 'google' | 'naver'
}

export const GOOGLE_HOST = /^(www\.|maps\.)?google\.[a-z.]+$/
export const NAVER_PLACE_HOST = /^((m\.)?map|(m|pcmap)\.place)\.naver\.com$/

const NUM = '(-?\\d+(?:\\.\\d+)?)'
const COORD_HASH = new RegExp(`^#${NUM},${NUM}$`)
const GOOGLE_PLACE_COORD = new RegExp(`!3d${NUM}!4d${NUM}`)
const COORD_TEXT = new RegExp(`^\\s*${NUM}\\s*,\\s*${NUM}\\s*$`)
// '지도 퍼가기' 임베드 코드의 pb 파라미터: !2d<경도>!3d<위도> 가 지도 중심(=장소 위치)
const EMBED_CENTER = new RegExp(`!2d${NUM}!3d${NUM}`)
// pb의 검색어 형태: !1s<위도>,<경도>
const EMBED_QUERY_COORD = new RegExp(`!1s${NUM},${NUM}(?:!|$)`)

export function parseUrl(url: string): URL | null {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export function isGoogleMapsUrl(parsed: URL): boolean {
  return (
    GOOGLE_HOST.test(parsed.hostname) &&
    (parsed.hostname.startsWith('maps.') || parsed.pathname.startsWith('/maps'))
  )
}

function toLatLng(lat: string, lng: string): LatLng | null {
  const point = { lat: Number(lat), lng: Number(lng) }
  return Math.abs(point.lat) <= 90 && Math.abs(point.lng) <= 180 ? point : null
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment.replace(/\+/g, ' '))
  } catch {
    return segment
  }
}

function decodeBase64Utf8(value: string): string | null {
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    return new TextDecoder().decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    )
  } catch {
    return null
  }
}

// pb의 장소 이름: '!1s0x…:0x…' (장소 ID) 바로 뒤의 !2s<텍스트> 또는 !2z<base64>
function embedPlaceName(pb: string): string | null {
  const match = pb.match(/!1s0x[0-9a-f]+(?::|%3A)0x[0-9a-f]+!2([sz])([^!]+)/i)
  if (!match) return null
  return match[1] === 'z' ? decodeBase64Utf8(match[2]) : decodeSegment(match[2])
}

function googlePlace(parsed: URL): PlaceRef | null {
  if (!isGoogleMapsUrl(parsed)) return null

  if (parsed.pathname.startsWith('/maps/embed')) {
    const pb = parsed.searchParams.get('pb') ?? ''
    const center = pb.match(EMBED_CENTER)
    const query = pb.match(EMBED_QUERY_COORD)
    const coords = center
      ? toLatLng(center[2], center[1])
      : query
        ? toLatLng(query[1], query[2])
        : null
    return coords
      ? { ...coords, name: embedPlaceName(pb), source: 'google' }
      : null
  }

  const placeName = parsed.pathname.match(/^\/maps\/place\/([^/@]+)/)
  const name = placeName ? decodeSegment(placeName[1]) : null

  // '/maps/place/…/data=…!3d<위도>!4d<경도>' 의 장소 좌표.
  // '@위도,경도'는 화면 중심이라 장소 좌표로 쓰지 않는다.
  const place = parsed.toString().match(GOOGLE_PLACE_COORD)
  if (place) {
    const coords = toLatLng(place[1], place[2])
    return coords ? { ...coords, name, source: 'google' } : null
  }

  const query = parsed.searchParams.get('q') ?? parsed.searchParams.get('query')
  const queryCoord = query?.match(COORD_TEXT)
  const coords = queryCoord ? toLatLng(queryCoord[1], queryCoord[2]) : null
  return coords ? { ...coords, name, source: 'google' } : null
}

// 네이버 장소 링크의 좌표는 lib/map-links.ts가 저장/빌드 시점에 '#위도,경도'로 붙여 둔다
function naverPlace(parsed: URL): PlaceRef | null {
  if (!NAVER_PLACE_HOST.test(parsed.hostname)) return null
  const hash = parsed.hash.match(COORD_HASH)
  const coords = hash ? toLatLng(hash[1], hash[2]) : null
  return coords ? { ...coords, name: null, source: 'naver' } : null
}

// 핀을 찍을 수 있는 정확한 장소 좌표가 있는 링크만 PlaceRef를 돌려준다
export function parsePlaceUrl(url: string): PlaceRef | null {
  const parsed = parseUrl(url)
  if (!parsed) return null
  return naverPlace(parsed) ?? googlePlace(parsed)
}
