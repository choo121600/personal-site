import Link from 'next/link'
import Image from 'next/image'
import type { PostMetadata } from '@/lib/posts'
import { CATEGORIES, categoryLabel, type CategorySlug } from '@/lib/categories'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 전체 + 글이 있는 카테고리만 보여준다
export function CategoryNav({
  posts,
  current,
}: {
  posts: PostMetadata[]
  current?: CategorySlug
}) {
  const counts = new Map<CategorySlug, number>()
  for (const post of posts) {
    if (post.category) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
    }
  }
  const items = [
    { href: '/blog', label: '전체', count: posts.length, active: !current },
    ...CATEGORIES.filter((category) => counts.has(category.slug)).map(
      (category) => ({
        href: `/blog/category/${category.slug}`,
        label: category.label,
        count: counts.get(category.slug)!,
        active: current === category.slug,
      }),
    ),
  ]

  return (
    <nav aria-label="카테고리" className="not-prose">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none aria-[current=page]:bg-zinc-900 aria-[current=page]:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 dark:aria-[current=page]:bg-zinc-100 dark:aria-[current=page]:text-zinc-900"
            >
              {item.label}
              <span className="text-xs tabular-nums opacity-60">
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function BlogPostList({ posts }: { posts: PostMetadata[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        아직 작성된 포스트가 없습니다.
      </p>
    )
  }

  return (
    <div className="not-prose space-y-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex gap-4 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          {post.thumbnail && (
            <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-md sm:w-40">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 96px, 128px"
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <h2 className="text-base leading-snug font-medium sm:text-lg">
              {post.title}
            </h2>
            {post.description && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
            )}
            {(post.date || post.category) && (
              <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                {post.category && categoryLabel(post.category)}
                {post.category && post.date && ' · '}
                {post.date && <time>{formatDate(post.date)}</time>}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
