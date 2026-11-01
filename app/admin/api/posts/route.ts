import { NextRequest, NextResponse } from 'next/server'
import {
  savePost,
  getPostBySlug,
  getAllPosts,
  deletePost,
  postExists,
} from '@/lib/posts'
import { slugify, uniqueSlug } from '@/lib/slug'
import { expandMapLinks } from '@/lib/map-links'

// GET: 포스트 목록 또는 특정 포스트 가져오기
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  if (slug) {
    const post = getPostBySlug(slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  }

  const posts = getAllPosts()
  return NextResponse.json(posts)
}

// POST: 새 포스트 저장 또는 기존 포스트 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, metadata } = body
    let slug: string = body.slug?.trim() ?? ''

    if (!content) {
      return NextResponse.json(
        { error: '본문을 입력해 주세요.' },
        { status: 400 },
      )
    }
    // 슬러그를 비워 두면 제목으로 만든다 (기존 글과 겹치지 않게)
    if (!slug) {
      const base = slugify(metadata?.title ?? '')
      if (!base) {
        return NextResponse.json(
          { error: '슬러그를 만들 제목을 입력해 주세요.' },
          { status: 400 },
        )
      }
      slug = uniqueSlug(base, postExists)
    }

    // 지도 링크(구글 단축/네이버)는 저장할 때 임베드 가능한 형태로 펼쳐 둔다 (빌드 시 네트워크 의존 제거)
    const savedContent = await expandMapLinks(content)
    savePost(slug, savedContent, metadata)

    return NextResponse.json({
      success: true,
      slug,
      content: savedContent,
    })
  } catch (error) {
    console.error('Save post error:', error)
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
  }
}

// DELETE: 포스트 삭제
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const deleted = deletePost(slug)

    if (!deleted) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      slug,
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 },
    )
  }
}
