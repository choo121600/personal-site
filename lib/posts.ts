import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PostMetadata {
  title: string
  description?: string
  date?: string
  thumbnail?: string
  slug: string
}

export interface Post extends PostMetadata {
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

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

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || '',
        thumbnail: data.thumbnail || '',
      }
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

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || '',
    thumbnail: data.thumbnail || '',
    content,
  }
}

// 포스트 저장
export function savePost(slug: string, content: string, metadata: Partial<PostMetadata> = {}) {
  ensurePostsDirectory()
  
  const frontmatter: Record<string, string> = {
    title: metadata.title || slug,
    description: metadata.description || '',
    date: metadata.date || new Date().toISOString().split('T')[0],
  }
  
  // thumbnail이 있을 때만 추가
  if (metadata.thumbnail) {
    frontmatter.thumbnail = metadata.thumbnail
  }

  const matterString = matter.stringify(content, frontmatter)
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  
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

