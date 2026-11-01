import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { isCategory, type CategorySlug } from './categories'

export interface PostMetadata {
  title: string
  description?: string
  date?: string
  thumbnail?: string
  category?: CategorySlug
  slug: string
}

export interface Post extends PostMetadata {
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

function parseCategory(value: unknown, slug: string): CategorySlug | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (!isCategory(value)) {
    throw new Error(
      `content/posts/${slug}.md: unknown category '${String(value)}' (see lib/categories.ts)`,
    )
  }
  return value
}

function toMetadata(
  slug: string,
  data: Record<string, unknown>,
): PostMetadata & { date: string } {
  return {
    slug,
    title: (data.title as string) || slug,
    description: (data.description as string) || '',
    date: (data.date as string) || '',
    thumbnail: (data.thumbnail as string) || '',
    category: parseCategory(data.category, slug),
  }
}

// 디렉토리가 없으면 생성
export function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// 모든 포스트 목록 가져오기
export function getAllPosts(): PostMetadata[] {
  ensurePostsDirectory()

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '')
      const fullPath = path.join(postsDirectory, `${slug}.md`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return toMetadata(slug, data)
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })

  return allPostsData
}

// 특정 포스트 가져오기
export function getPostBySlug(slug: string): Post | null {
  ensurePostsDirectory()

  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { ...toMetadata(slug, data), content }
}

// 포스트 저장
export function savePost(
  slug: string,
  content: string,
  metadata: Partial<PostMetadata> = {},
) {
  ensurePostsDirectory()

  const fullPath = path.join(postsDirectory, `${slug}.md`)
  // 에디터가 다루지 않는 frontmatter 필드는 기존 파일 값을 유지한다
  const existing = fs.existsSync(fullPath)
    ? matter(fs.readFileSync(fullPath, 'utf8')).data
    : {}

  const frontmatter: Record<string, unknown> = {
    ...existing,
    title: metadata.title || slug,
    description: metadata.description || '',
    date: metadata.date || new Date().toISOString().split('T')[0],
  }

  // 비어 있으면 필드 자체를 뺀다
  for (const key of ['thumbnail', 'category'] as const) {
    if (metadata[key]) frontmatter[key] = metadata[key]
    else delete frontmatter[key]
  }
  parseCategory(frontmatter.category, slug)

  const matterString = matter.stringify(content, frontmatter)

  fs.writeFileSync(fullPath, matterString, 'utf8')
}

// 포스트 삭제
export function deletePost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
    return true
  }

  return false
}
