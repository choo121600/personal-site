import { getAllPosts, getPostBySlug } from './posts'
import { expandMapLinks } from './map-links'
import { parsePlaceUrl, type LatLng } from './map-coords'

export interface MapPlacePost {
  slug: string
  title: string
  date: string
  thumbnail: string
}

export interface MapPlace extends LatLng {
  id: string
  name: string
  // 장소 원본 링크 (네이버/구글 지도)
  url: string
  posts: MapPlacePost[]
}

// [라벨](url), 맨 URL, <iframe src="url"> 의 URL
const LINK =
  /\[([^\]\n]*)\]\((https?:\/\/[^\s)]+)\)|(?<!\]\()(https?:\/\/[^\s<>)\]"']+)/g

// 같은 장소를 여러 글에서 언급하면 마커 하나로 묶는다 (약 10m 단위)
function placeKey({ lat, lng }: LatLng): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`
}

// 글 본문의 지도 링크에서 좌표가 있는 장소를 모은다. 빌드 시점에 실행된다.
export async function getMapPlaces(): Promise<MapPlace[]> {
  const places = new Map<string, MapPlace>()

  for (const meta of getAllPosts()) {
    const post = getPostBySlug(meta.slug)
    if (!post) continue
    const content = await expandMapLinks(post.content)
    const postRef: MapPlacePost = {
      slug: post.slug,
      title: post.title,
      date: post.date ?? '',
      thumbnail: post.thumbnail ?? '',
    }

    for (const match of content.matchAll(LINK)) {
      const label = match[1]?.trim()
      const url = match[2] ?? match[3]
      const ref = parsePlaceUrl(url.replace(/&amp;/g, '&'))
      if (!ref) continue
      const coords = { lat: ref.lat, lng: ref.lng }

      const key = placeKey(coords)
      const existing = places.get(key)
      if (existing) {
        if (!existing.posts.some((p) => p.slug === post.slug)) {
          existing.posts.push(postRef)
        }
        continue
      }
      places.set(key, {
        id: key,
        ...coords,
        name: label || ref.name || post.title,
        url,
        posts: [postRef],
      })
    }
  }

  return [...places.values()]
}
