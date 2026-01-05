'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { YouTubeEmbed, extractYouTubeId, isYouTubeUrl } from './YouTubeEmbed'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 커스텀 컴포넌트들
const components: Components = {
  // 링크에서 유튜브 URL 감지 후 임베딩으로 변환
  a: ({ href, children, ...props }) => {
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
  // 단독 유튜브 URL (링크 없이 URL만 작성한 경우)
  p: ({ children, ...props }) => {
    // children이 단일 문자열이고 유튜브 URL인 경우
    if (
      typeof children === 'string' ||
      (Array.isArray(children) && children.length === 1 && typeof children[0] === 'string')
    ) {
      const text = typeof children === 'string' ? children : (children[0] as string)
      const trimmed = text.trim()
      
      if (isYouTubeUrl(trimmed)) {
        const videoId = extractYouTubeId(trimmed)
        if (videoId) {
          return <YouTubeEmbed videoId={videoId} />
        }
      }
    }
    return <p {...props}>{children}</p>
  },
  // iframe 스타일링 (HTML로 직접 작성한 경우)
  iframe: ({ ...props }) => {
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
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}


