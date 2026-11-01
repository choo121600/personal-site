import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { CATEGORIES, categoryLabel, isCategory } from '@/lib/categories'
import { BlogPostList, CategoryNav } from '@/components/BlogPostList'

interface PageProps {
  params: Promise<{ category: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params
  return isCategory(category)
    ? { title: `${categoryLabel(category)} - Blog` }
    : { title: 'Category Not Found' }
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category } = await params
  if (!isCategory(category)) notFound()

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
      <CategoryNav posts={posts} current={category} />
      <BlogPostList
        posts={posts.filter((post) => post.category === category)}
      />
    </div>
  )
}
