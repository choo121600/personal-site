// 서버 전용: 본문의 지도 링크를 임베드할 수 있는 형태로 펼친다. 실패한 링크는 그대로 둔다.
// - 구글 공유 단축 링크(maps.app.goo.gl): 좌표가 없어서 리다이렉트 목적지로 바꾼다
// - 네이버 지도 링크(naver.me, map.naver.com 장소): 장소 ID로 이름/좌표를 조회해
//   '[장소 이름](https://map.naver.com/p/entry/place/<ID>#위도,경도)'로 바꾼다.
//   네이버 지도 웹이 쓰는 비공개 API라 언제든 바뀔 수 있다 — 바뀌면 링크로 남을 뿐이다.

// 앱 공유 링크는 '?g_st=ic' 같은 쿼리가 붙어 온다
const GOOGLE_SHORT_LINK =
  /https:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)\/[A-Za-z0-9_-]+(?:\?[^\s)\]]*)?/g

// 앞의 '[라벨](' 은 이미 마크다운 링크인지 판별하려고 같이 잡는다
const NAVER_LINK =
  /(\[[^\]\n]*\]\()?(https:\/\/(?:naver\.me\/[A-Za-z0-9]+|(?:m\.)?map\.naver\.com\/[^\s)\]]+|(?:m|pcmap)\.place\.naver\.com\/[^\s)\]]+))/g

const NAVER_PLACE_ID =
  /^https:\/\/(?:(?:m\.)?map\.naver\.com\/(?:p|v5)\/(?:entry|search\/[^/]+)\/place\/|(?:m|pcmap)\.place\.naver\.com\/[a-z]+\/)(\d+)/

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

interface NaverPlace {
  id: string
  name: string
  lat: number
  lng: number
}

async function redirectTarget(url: string): Promise<URL | null> {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      cache: 'force-cache',
      headers: { 'User-Agent': BROWSER_UA },
    })
    const location = res.headers.get('location')
    return location ? new URL(location, url) : null
  } catch {
    return null
  }
}

async function resolveGoogleShortLink(url: string): Promise<string | null> {
  const target = await redirectTarget(url)
  return target && /(^|\.)google\.[a-z.]+$/.test(target.hostname)
    ? target.toString()
    : null
}

async function naverPlaceId(url: string): Promise<string | null> {
  const direct = url.match(NAVER_PLACE_ID)
  if (direct) return direct[1]
  if (!url.startsWith('https://naver.me/')) return null

  const target = await redirectTarget(url)
  return target?.toString().match(NAVER_PLACE_ID)?.[1] ?? null
}

async function fetchNaverPlace(id: string): Promise<NaverPlace | null> {
  try {
    const res = await fetch(`https://map.naver.com/p/api/place/summary/${id}`, {
      cache: 'force-cache',
      headers: {
        'User-Agent': BROWSER_UA,
        Referer: 'https://map.naver.com/',
      },
    })
    if (!res.ok) return null
    const detail = (await res.json())?.data?.placeDetail
    const lat = Number(detail?.coordinate?.latitude)
    const lng = Number(detail?.coordinate?.longitude)
    if (typeof detail?.name !== 'string' || !lat || !lng) return null
    return { id, name: detail.name, lat, lng }
  } catch {
    return null
  }
}

async function resolveNaverLink(url: string): Promise<NaverPlace | null> {
  // 이미 좌표가 붙은 링크는 다시 조회하지 않는다
  if (/#-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(url)) return null
  const id = await naverPlaceId(url)
  return id ? fetchNaverPlace(id) : null
}

async function resolveAll<T>(
  urls: Iterable<string>,
  resolve: (url: string) => Promise<T | null>,
): Promise<Map<string, T | null>> {
  const unique = [...new Set(urls)]
  return new Map(
    await Promise.all(
      unique.map(async (url) => [url, await resolve(url)] as const),
    ),
  )
}

export async function expandMapLinks(content: string): Promise<string> {
  const google = await resolveAll(
    content.match(GOOGLE_SHORT_LINK) ?? [],
    resolveGoogleShortLink,
  )
  let result = content.replace(
    GOOGLE_SHORT_LINK,
    (url) => google.get(url) ?? url,
  )

  const naver = await resolveAll(
    [...result.matchAll(NAVER_LINK)].map((m) => m[2]),
    resolveNaverLink,
  )
  result = result.replace(
    NAVER_LINK,
    (match, linkStart: string | undefined, url: string) => {
      const place = naver.get(url)
      if (!place) return match
      const href = `https://map.naver.com/p/entry/place/${place.id}#${place.lat},${place.lng}`
      // 맨 URL은 장소 이름을 라벨로 붙인 링크로, 기존 [라벨](...)은 URL만 바꾼다
      return linkStart ? `${linkStart}${href}` : `[${place.name}](${href})`
    },
  )
  return result
}
