import { NextRequest, NextResponse } from 'next/server'
import {
  deleteTalk,
  getAllTalks,
  getTalkBySlug,
  saveTalk,
  TalkValidationError,
  type TalkDetail,
} from '@/lib/talks'

// GET: 발표 목록 또는 특정 발표
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (slug) {
    const talk = getTalkBySlug(slug)
    return talk
      ? NextResponse.json(talk)
      : NextResponse.json({ error: 'Talk not found' }, { status: 404 })
  }
  return NextResponse.json(getAllTalks())
}

// POST: 발표 저장 (새로 만들기/수정)
export async function POST(request: NextRequest) {
  try {
    const talk: TalkDetail = await request.json()
    saveTalk(talk)
    return NextResponse.json({ success: true, slug: talk.slug })
  } catch (error) {
    if (error instanceof TalkValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Save talk error:', error)
    return NextResponse.json({ error: 'Failed to save talk' }, { status: 500 })
  }
}

// DELETE: 발표 삭제
export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }
  return deleteTalk(slug)
    ? NextResponse.json({ success: true, slug })
    : NextResponse.json({ error: 'Talk not found' }, { status: 404 })
}
