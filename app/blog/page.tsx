import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { BlogPostList, CategoryNav } from '@/components/BlogPostList'

export default function BlogListPage() {
  const posts = getAllPosts()

  return (
    <div className="space-y-6">
      <div className="not-prose flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link
          href="/map"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Map →
        </Link>
      </div>
      <CategoryNav posts={posts} />
      <BlogPostList posts={posts} />
    </div>
  )
}
