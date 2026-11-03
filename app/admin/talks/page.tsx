'use client'

import { useEffect, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Plus, Save, Trash2 } from 'lucide-react'
import {
  TALK_TYPES,
  formatTalkDate,
  type TalkDetail,
  type TalkMetadata,
} from '@/lib/talk-types'

const MarkdownRenderer = dynamic(
  () =>
    import('@/components/MarkdownRenderer').then((mod) => mod.MarkdownRenderer),
  { ssr: false },
)

const CodeMirrorEditor = dynamic(() => import('../editor/CodeMirrorEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-sm text-zinc-500">에디터 로딩 중...</div>
    </div>
  ),
})

type TalkForm = Omit<
  TalkDetail,
  'descriptionKo' | 'eventUrl' | 'slides' | 'video'
> & {
  descriptionKo: string
  eventUrl: string
  slides: string
  video: string
}

function emptyTalk(): TalkForm {
  return {
    slug: '',
    title: '',
    event: '',
    date: new Date().toISOString().slice(0, 7),
    type: 'talk',
    description: '',
    descriptionKo: '',
    eventUrl: '',
    slides: '',
    video: '',
    hideOnResume: false,
    content: '',
  }
}

function toForm(talk: TalkDetail): TalkForm {
  return {
    ...talk,
    descriptionKo: talk.descriptionKo ?? '',
    eventUrl: talk.eventUrl ?? '',
    slides: talk.slides ?? '',
    video: talk.video ?? '',
  }
}

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:disabled:bg-zinc-900'

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
      >
        {label}
        {hint && <span className="ml-1 font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default function TalksEditorPage() {
  const [talks, setTalks] = useState<TalkMetadata[]>([])
  const [form, setForm] = useState<TalkForm>(emptyTalk)
  // 불러온 발표를 고치는 중이면 그 slug (slug 변경 = 다른 파일이 되므로 막는다)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadTalks = async () => {
    const response = await fetch('/admin/api/talks')
    setTalks(await response.json())
  }

  useEffect(() => {
    loadTalks()
  }, [])

  const update = <K extends keyof TalkForm>(key: K, value: TalkForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const loadTalk = async (slug: string) => {
    const response = await fetch(`/admin/api/talks?slug=${slug}`)
    if (!response.ok) {
      alert('발표를 불러오지 못했습니다.')
      return
    }
    setForm(toForm(await response.json()))
    setEditingSlug(slug)
  }

  const createTalk = () => {
    setForm(emptyTalk())
    setEditingSlug(null)
  }

  const saveTalk = async () => {
    if (
      !editingSlug &&
      form.slug.trim() &&
      talks.some((talk) => talk.slug === form.slug.trim()) &&
      !confirm(`"${form.slug}" 발표가 이미 있습니다. 덮어쓸까요?`)
    ) {
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch('/admin/api/talks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: form.slug.trim() }),
      })
      const result = await response.json()
      if (!response.ok) {
        alert(`저장 실패: ${result.error}`)
        return
      }
      setForm((prev) => ({ ...prev, slug: result.slug }))
      setEditingSlug(result.slug)
      await loadTalks()
      alert('저장되었습니다!')
    } catch (error) {
      console.error('Failed to save talk:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteTalk = async (slug: string) => {
    if (!confirm(`"${slug}" 발표를 삭제하시겠습니까?`)) return
    const response = await fetch(`/admin/api/talks?slug=${slug}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      alert('삭제에 실패했습니다.')
      return
    }
    if (editingSlug === slug) createTalk()
    await loadTalks()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-xl font-semibold">발표 에디터</h1>
            <Link
              href="/admin/editor"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              블로그 에디터
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={createTalk}
              className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" />새 발표
            </button>
            <button
              onClick={saveTalk}
              disabled={isSaving || (!form.slug.trim() && !form.title.trim())}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Save className="h-4 w-4" />
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              발표 목록
            </h2>
            {talks.length === 0 && (
              <p className="text-sm text-zinc-500">아직 발표가 없습니다.</p>
            )}
            <div className="space-y-1">
              {talks.map((talk) => (
                <div
                  key={talk.slug}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    editingSlug === talk.slug
                      ? 'bg-zinc-100 dark:bg-zinc-800'
                      : ''
                  }`}
                >
                  <button
                    onClick={() => loadTalk(talk.slug)}
                    className="flex-1 text-left text-sm"
                  >
                    <span className="block">{talk.title}</span>
                    <span className="block text-xs text-zinc-500 tabular-nums">
                      {formatTalkDate(talk.date, 'ko')}
                    </span>
                  </button>
                  <button
                    onClick={() => deleteTalk(talk.slug)}
                    aria-label={`${talk.title} 삭제`}
                    className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-4 overflow-y-auto border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Field
                label="슬러그 (URL 경로)"
                htmlFor="talk-slug"
                hint={editingSlug ? '수정 불가' : undefined}
              >
                <input
                  id="talk-slug"
                  value={form.slug}
                  onChange={(e) => update('slug', e.target.value)}
                  disabled={editingSlug !== null}
                  placeholder="비우면 제목으로 자동 생성"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field
                label="날짜"
                htmlFor="talk-date"
                hint="YYYY / YYYY-MM / YYYY-MM-DD"
              >
                <input
                  id="talk-date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  placeholder="2026-02"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="종류" htmlFor="talk-type">
                <select
                  id="talk-type"
                  value={form.type}
                  onChange={(e) =>
                    update('type', e.target.value as TalkForm['type'])
                  }
                  className={INPUT_CLASS}
                >
                  {TALK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.hideOnResume}
                    onChange={(e) => update('hideOnResume', e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  이력서에서 숨기기
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="제목" htmlFor="talk-title">
                <input
                  id="talk-title"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="발표 제목"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="행사" htmlFor="talk-event">
                <input
                  id="talk-event"
                  value={form.event}
                  onChange={(e) => update('event', e.target.value)}
                  placeholder="Snowflake World Tour Seoul 2025"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field
                label="설명 (영문)"
                htmlFor="talk-description"
                hint="홈·발표 페이지·영문 이력서"
              >
                <textarea
                  id="talk-description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={2}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field
                label="설명 (국문)"
                htmlFor="talk-description-ko"
                hint="국문 이력서, 비우면 영문 사용"
              >
                <textarea
                  id="talk-description-ko"
                  value={form.descriptionKo}
                  onChange={(e) => update('descriptionKo', e.target.value)}
                  rows={2}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="행사 페이지" htmlFor="talk-event-url">
                <input
                  id="talk-event-url"
                  type="url"
                  value={form.eventUrl}
                  onChange={(e) => update('eventUrl', e.target.value)}
                  placeholder="https://"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="슬라이드" htmlFor="talk-slides">
                <input
                  id="talk-slides"
                  type="url"
                  value={form.slides}
                  onChange={(e) => update('slides', e.target.value)}
                  placeholder="https://"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field
                label="영상"
                htmlFor="talk-video"
                hint="유튜브면 페이지에 임베드"
              >
                <input
                  id="talk-video"
                  type="url"
                  value={form.video}
                  onChange={(e) => update('video', e.target.value)}
                  placeholder="https://youtu.be/..."
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/2 min-w-0 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800">
              <CodeMirrorEditor
                value={form.content}
                onChange={(value) => update('content', value)}
              />
            </div>
            <div className="w-1/2 min-w-0 flex-shrink-0 overflow-y-auto p-8">
              {form.content.trim() ? (
                <MarkdownRenderer content={form.content} />
              ) : (
                <p className="text-sm text-zinc-500">
                  본문은 선택입니다. 초록, 후기, 관련 링크를 마크다운으로 적으면
                  발표 페이지 아래에 나옵니다.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
