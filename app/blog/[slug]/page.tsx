import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { expandMapLinks } from '@/lib/map-links'
import type { Metadata } from 'next'
import Link from 'next/link'
import { categoryLabel } from '@/lib/categories'

interface PageProps {
  params: Promise<{ slug: string }>
}

// 정적 경로 생성 (빌드 시)
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description || '',
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">{post.title}</h1>
        {post.description && (
          <p className="text-zinc-600 dark:text-zinc-400">{post.description}</p>
        )}
        <p className="not-prose text-sm text-zinc-500 dark:text-zinc-400">
          {post.date && (
            <time>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.date && post.category && ' · '}
          {post.category && (
            <Link
              href={`/blog/category/${post.category}`}
              className="underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-zinc-900 dark:decoration-zinc-600 dark:hover:text-zinc-100"
            >
              {categoryLabel(post.category)}
            </Link>
          )}
        </p>
      </header>
      <MarkdownRenderer content={await expandMapLinks(post.content)} />
    </article>
  )
}
