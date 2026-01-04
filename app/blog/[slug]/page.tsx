import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { Metadata } from 'next'

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
        {post.date && (
          <time className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </header>
      <MarkdownRenderer content={post.content} />
    </article>
  )
}

