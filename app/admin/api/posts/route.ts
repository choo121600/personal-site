import { NextRequest, NextResponse } from 'next/server'
import { savePost, getPostBySlug, getAllPosts, deletePost } from '@/lib/posts'

// GET: 포스트 목록 또는 특정 포스트 가져오기
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  if (slug) {
    const post = getPostBySlug(slug)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
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
    const { slug, content, metadata } = body

    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Slug and content are required' },
        { status: 400 }
      )
    }

    savePost(slug, content, metadata)

    return NextResponse.json({
      success: true,
      slug,
    })
  } catch (error) {
    console.error('Save post error:', error)
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    )
  }
}

// DELETE: 포스트 삭제
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const deleted = deletePost(slug)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      slug,
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}


