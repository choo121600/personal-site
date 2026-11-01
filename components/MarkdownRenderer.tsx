'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { YouTubeEmbed } from './YouTubeEmbed'
import { extractYouTubeId, isYouTubeUrl } from '@/lib/youtube'
import { MapEmbed } from './MapEmbed'
import { parsePlaceUrl } from '@/lib/map-coords'
import type { Components } from 'react-markdown'
import type { Element } from 'hast'

interface MarkdownRendererProps {
  content: string
  className?: string
}

function textOf(node: Element): string {
  return node.children
    .map((child) =>
      child.type === 'text'
        ? child.value
        : child.type === 'element'
          ? textOf(child)
          : '',
    )
    .join('')
}

// 문단이 URL(또는 링크) 하나로만 이루어졌는지 확인한다.
// remark-gfm의 autolink 때문에 맨 URL도 <a>로 변환되므로 텍스트와 링크를 모두 본다.
// label은 [이름](url) 형태일 때의 링크 텍스트다.
function soleLink(
  node: Element | undefined,
): { url: string; label: string | null } | null {
  const children = (node?.children ?? []).filter(
    (child) => !(child.type === 'text' && child.value.trim() === ''),
  )
  if (children.length !== 1) return null

  const child = children[0]
  if (child.type === 'text') {
    const url = child.value.trim()
    return /^https?:\/\/\S+$/.test(url) ? { url, label: null } : null
  }
  if (child.type === 'element' && child.tagName === 'a') {
    const url = String(child.properties?.href ?? '')
    const label = textOf(child).trim()
    return url ? { url, label: label && label !== url ? label : null } : null
  }
  return null
}

// 지도 앱의 '공유'는 "([네이버 지도]\n)장소 이름\n(주소\n)링크"처럼 여러 줄로 복사된다.
// 앞줄이 텍스트(줄바꿈 포함)뿐이고 마지막이 지도 링크인 문단이면 앞줄을 캡션으로 쓴다.
const SHARE_HEADER = /^\[?네이버\s?지도\]?$/
function sharedMapLink(
  node: Element | undefined,
): { url: string; caption: string } | null {
  const children = (node?.children ?? []).filter(
    (child) => !(child.type === 'text' && child.value.trim() === ''),
  )
  const last = children.at(-1)
  if (!last || last.type !== 'element' || last.tagName !== 'a') return null

  const lines: string[] = []
  for (const child of children.slice(0, -1)) {
    if (child.type === 'text') lines.push(child.value.trim())
    else if (child.type !== 'element' || child.tagName !== 'br') return null
  }
  if (lines.length === 0) return null

  return {
    url: String(last.properties?.href ?? ''),
    caption: lines
      .filter((line) => line && !SHARE_HEADER.test(line))
      .join(' · '),
  }
}

// 커스텀 컴포넌트들
const components: Components = {
  // 링크에서 유튜브 URL 감지 후 임베딩으로 변환
  a: ({ node, href, children, ...props }) => {
    if (href && isYouTubeUrl(href)) {
      const videoId = extractYouTubeId(href)
      if (videoId) {
        return <YouTubeEmbed videoId={videoId} title={String(children)} />
      }
    }
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  // 단독 유튜브/지도 URL 문단은 <p> 대신 임베드로 교체한다.
  // (<p> 안에 임베드 <div>가 들어가면 HTML 중첩이 깨져 하이드레이션이 어긋난다)
  p: ({ node, children, ...props }) => {
    const link = soleLink(node)
    if (link) {
      const videoId = extractYouTubeId(link.url)
      if (videoId) {
        return <YouTubeEmbed videoId={videoId} />
      }
      const place = parsePlaceUrl(link.url)
      if (place) {
        return (
          <MapEmbed
            place={place}
            href={link.url}
            title={link.label ?? undefined}
          />
        )
      }
    }
    const shared = sharedMapLink(node)
    if (shared) {
      const place = parsePlaceUrl(shared.url)
      if (place) {
        return (
          <MapEmbed place={place} href={shared.url} title={shared.caption} />
        )
      }
    }
    return <p {...props}>{children}</p>
  },
  // 넓은 표가 본문 레이아웃을 밀어내지 않도록 가로 스크롤로 감싸기
  table: ({ node, children, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="my-0 w-full">
        {children}
      </table>
    </div>
  ),
  // iframe 스타일링 (HTML로 직접 작성한 경우)
  iframe: ({ node, ...props }) => {
    // 유튜브 iframe인 경우 스타일링 적용
    const src = props.src as string | undefined
    if (src?.includes('youtube.com') || src?.includes('youtu.be')) {
      return (
        <div className="relative my-6 aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            {...props}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
          />
        </div>
      )
    }
    // '지도 퍼가기'로 복사한 구글 지도 iframe → 좌표를 읽어 OSM 지도로 그린다
    const place = src ? parsePlaceUrl(src) : null
    if (place) {
      return (
        <MapEmbed
          place={place}
          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
          title={props.title}
        />
      )
    }
    return <iframe {...props} />
  },
}

export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-gray dark:prose-invert max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
