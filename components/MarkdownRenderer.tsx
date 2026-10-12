'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { YouTubeEmbed, extractYouTubeId, isYouTubeUrl } from './YouTubeEmbed'
import type { Components } from 'react-markdown'
import type { Element } from 'hast'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 문단이 유튜브 URL 하나로만 이루어졌는지 확인한다.
// remark-gfm의 autolink 때문에 맨 URL도 <a>로 변환되므로 텍스트와 링크를 모두 본다.
function soleYouTubeUrl(node: Element | undefined): string | null {
  const children = (node?.children ?? []).filter(
    (child) => !(child.type === 'text' && child.value.trim() === '')
  )
  if (children.length !== 1) return null

  const child = children[0]
  const url =
    child.type === 'text'
      ? child.value.trim()
      : child.type === 'element' && child.tagName === 'a'
        ? String(child.properties?.href ?? '')
        : ''

  return url && isYouTubeUrl(url) ? url : null
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
  // 단독 유튜브 URL 문단은 <p> 대신 임베드로 교체한다.
  // (<p> 안에 임베드 <div>가 들어가면 HTML 중첩이 깨져 하이드레이션이 어긋난다)
  p: ({ node, children, ...props }) => {
    const url = soleYouTubeUrl(node)
    if (url) {
      const videoId = extractYouTubeId(url)
      if (videoId) {
        return <YouTubeEmbed videoId={videoId} />
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
    return <iframe {...props} />
  },
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-gray max-w-none dark:prose-invert ${className}`}>
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


