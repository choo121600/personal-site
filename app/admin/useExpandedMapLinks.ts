'use client'

import { useEffect, useState } from 'react'

// 서버에서만 펼칠 수 있는 지도 링크(구글 단축/네이버, 좌표 없는 구글 링크)가 있는지
const MAP_LINK =
  /https:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps|naver\.me|(?:m\.)?map\.naver\.com|(?:m|pcmap)\.place\.naver\.com|(?:www\.|maps\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+)/

// 미리보기용: 입력이 멈추면 서버에서 지도 링크를 펼친 본문을 받아 온다.
// 펼치기 전이나 실패하면 원래 본문을 그대로 보여 준다.
export function useExpandedMapLinks(content: string): string {
  const [expanded, setExpanded] = useState({ source: '', content: '' })

  useEffect(() => {
    if (!MAP_LINK.test(content)) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/admin/api/map-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
          signal: controller.signal,
        })
        if (!res.ok) return
        const data: { content: string } = await res.json()
        setExpanded({ source: content, content: data.content })
      } catch {
        // 취소되었거나 실패하면 원래 본문을 보여 준다
      }
    }, 600)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [content])

  return expanded.source === content ? expanded.content : content
}
