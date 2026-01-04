import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'

export default function BlogListPage() {
  const posts = getAllPosts()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            아직 작성된 포스트가 없습니다.
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-4 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {post.thumbnail && (
                <div className="relative aspect-[4/3] w-24 flex-shrink-0 overflow-hidden rounded-md sm:w-32">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="not-prose m-0 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <h1 className="text-base font-medium leading-snug sm:text-lg">{post.title}</h1>
                {post.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {post.description}
                  </p>
                )}
                {post.date && (
                  <time className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

