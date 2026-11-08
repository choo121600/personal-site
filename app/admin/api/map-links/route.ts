import { NextRequest, NextResponse } from 'next/server'
import { expandMapLinks } from '@/lib/map-links'

// POST: 에디터 미리보기용. 저장 전 본문의 지도 링크(구글 단축/네이버)를 펼쳐 돌려준다
export async function POST(request: NextRequest) {
  const { content } = await request.json()
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }
  return NextResponse.json({ content: await expandMapLinks(content) })
}
