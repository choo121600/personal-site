'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Save, Eye, FileText, X, Plus, Trash2, Image } from 'lucide-react'

// MarkdownRenderer를 동적으로 로드 (SSR 방지)
const MarkdownRenderer = dynamic(
  () => import('@/components/MarkdownRenderer').then((mod) => mod.MarkdownRenderer),
  { ssr: false }
)

// CodeMirror 에디터 컴포넌트를 완전히 클라이언트 전용으로 분리
const CodeMirrorEditor = dynamic(
  () => import('./CodeMirrorEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-zinc-500">에디터 로딩 중...</div>
      </div>
    )
  }
)

interface PostMetadata {
  title: string
  description: string
  date: string
  thumbnail: string
}

export default function EditorPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [metadata, setMetadata] = useState<PostMetadata>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    thumbnail: '',
  })
  const [splitView, setSplitView] = useState(true)
  const [posts, setPosts] = useState<Array<{ slug: string; title: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  // 포스트 목록 로드
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch('/admin/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  // 포스트 로드
  const loadPost = async (postSlug: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/admin/api/posts?slug=${postSlug}`)
      if (response.ok) {
        const data = await response.json()
        setSlug(data.slug)
        setContent(data.content)
        setMetadata({
          title: data.title || '',
          description: data.description || '',
          date: data.date || new Date().toISOString().split('T')[0],
          thumbnail: data.thumbnail || '',
        })
      }
    } catch (error) {
      console.error('Failed to load post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 포스트 저장
  const savePost = async () => {
    if (!slug.trim()) {
      alert('슬러그를 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/admin/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: slug.trim(),
          content,
          metadata,
        }),
      })

      if (response.ok) {
        await loadPosts()
        alert('저장되었습니다!')
        router.refresh()
      } else {
        const error = await response.json()
        alert(`저장 실패: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 포스트 삭제
  const deletePost = async (postSlug: string) => {
    if (!confirm(`"${postSlug}" 포스트를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/admin/api/posts?slug=${postSlug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadPosts()
        if (slug === postSlug) {
          setSlug('')
          setContent('')
          setMetadata({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            thumbnail: '',
          })
        }
        alert('삭제되었습니다.')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  // 새 포스트 생성
  const createNewPost = () => {
    setSlug('')
    setContent('')
    setMetadata({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      thumbnail: '',
    })
  }

  // 이미지 붙여넣기 처리
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = items[i].getAsFile()
        if (file) {
          await uploadImage(file)
        }
        return
      }
    }
  }

  // 이미지 업로드
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/admin/api/images', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageMarkdown = `![${file.name}](${data.path})`
        
        // 끝에 이미지 마크다운 추가
        setContent((prev) => {
          const trimmed = prev.trim()
          return trimmed ? `${trimmed}\n\n${imageMarkdown}\n` : `${imageMarkdown}\n`
        })
      } else {
        alert('이미지 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    }
  }

  // 파일 선택으로 이미지 업로드
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      await uploadImage(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 썸네일 업로드
  const uploadThumbnail = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/admin/api/images', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setMetadata((prev) => ({ ...prev, thumbnail: data.path }))
      } else {
        alert('썸네일 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error)
      alert('썸네일 업로드 중 오류가 발생했습니다.')
    }
  }

  // 썸네일 파일 선택
  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      await uploadThumbnail(file)
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* 헤더 */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">블로그 에디터</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={createNewPost}
              className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" />
              새 포스트
            </button>
            <button
              onClick={() => setSplitView(!splitView)}
              className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              {splitView ? <FileText className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {splitView ? '에디터만' : '나란히 보기'}
            </button>
            <button
              onClick={savePost}
              disabled={isLoading || !slug.trim()}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Save className="h-4 w-4" />
              저장
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 - 포스트 목록 */}
        <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              포스트 목록
            </h2>
            <div className="space-y-1">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <button
                    onClick={() => loadPost(post.slug)}
                    className="flex-1 text-left text-sm"
                  >
                    {post.title || post.slug}
                  </button>
                  <button
                    onClick={() => deletePost(post.slug)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* 메타데이터 입력 */}
          <div className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  슬러그 (URL 경로)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-post-title"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  제목
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) =>
                    setMetadata({ ...metadata, title: e.target.value })
                  }
                  placeholder="포스트 제목"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  날짜
                </label>
                <input
                  type="date"
                  value={metadata.date}
                  onChange={(e) =>
                    setMetadata({ ...metadata, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  설명
                </label>
                <input
                  type="text"
                  value={metadata.description}
                  onChange={(e) =>
                    setMetadata({ ...metadata, description: e.target.value })
                  }
                  placeholder="포스트 설명"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  썸네일
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={metadata.thumbnail}
                    onChange={(e) =>
                      setMetadata({ ...metadata, thumbnail: e.target.value })
                    }
                    placeholder="/images/thumbnail.png"
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    title="썸네일 업로드"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  {metadata.thumbnail && (
                    <button
                      onClick={() => setMetadata({ ...metadata, thumbnail: '' })}
                      className="flex items-center rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      title="썸네일 제거"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {metadata.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={metadata.thumbnail}
                      alt="썸네일 미리보기"
                      className="h-16 w-auto rounded border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-zinc-600 underline dark:text-zinc-400"
              >
                본문 이미지 파일 선택
              </button>
              <span className="ml-2 text-xs text-zinc-500">
                또는 클립보드에서 이미지를 붙여넣으세요
              </span>
            </div>
          </div>

          {/* 에디터/미리보기 */}
          <div className="flex flex-1 overflow-hidden">
            {splitView ? (
              <>
                {/* 에디터 */}
                <div className="w-1/2 min-w-0 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800">
                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center">
                        <div className="text-sm text-zinc-500">에디터 로딩 중...</div>
                      </div>
                    }
                  >
                    <CodeMirrorEditor
                      value={content}
                      onChange={setContent}
                      onPaste={handlePaste}
                    />
                  </Suspense>
                </div>
                {/* 미리보기 */}
                <div className="w-1/2 min-w-0 flex-shrink-0 overflow-y-auto p-8">
                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center">
                        <div className="text-sm text-zinc-500">미리보기 로딩 중...</div>
                      </div>
                    }
                  >
                    <MarkdownRenderer content={content} />
                  </Suspense>
                </div>
              </>
            ) : (
              <div className="flex-1">
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center">
                      <div className="text-sm text-zinc-500">에디터 로딩 중...</div>
                    </div>
                  }
                >
                  <CodeMirrorEditor
                    value={content}
                    onChange={setContent}
                    onPaste={handlePaste}
                  />
                </Suspense>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

