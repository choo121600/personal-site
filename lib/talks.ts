import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  TALK_DATE_PATTERN,
  type TalkDetail,
  type TalkMetadata,
  type TalkType,
} from './talk-types'

export type { TalkDetail, TalkMetadata, TalkType } from './talk-types'
export { formatTalkDate } from './talk-types'

const talksDirectory = path.join(process.cwd(), 'content', 'talks')

const TALK_TYPES: TalkType[] = ['talk', 'workshop']

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  file: string,
) {
  const value = data[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`content/talks/${file}: '${key}' is required`)
  }
  return value
}

function parseTalk(fileName: string): { meta: TalkMetadata; content: string } {
  const slug = fileName.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(talksDirectory, fileName), 'utf8')
  const { data, content } = matter(raw)

  // 따옴표 없이 쓴 YAML 날짜는 Date 객체로 파싱된다
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10)
  }

  const date = requireString(data, 'date', fileName)
  if (!TALK_DATE_PATTERN.test(date)) {
    throw new Error(
      `content/talks/${fileName}: 'date' must be YYYY-MM or YYYY-MM-DD, got '${date}'`,
    )
  }

  const type = data.type ?? 'talk'
  if (!TALK_TYPES.includes(type)) {
    throw new Error(
      `content/talks/${fileName}: 'type' must be one of ${TALK_TYPES.join(', ')}`,
    )
  }

  const meta: TalkMetadata = {
    slug,
    title: requireString(data, 'title', fileName),
    event: requireString(data, 'event', fileName),
    date,
    type,
    description: requireString(data, 'description', fileName),
    descriptionKo: optionalString(data.descriptionKo),
    eventUrl: optionalString(data.eventUrl),
    slides: optionalString(data.slides),
    video: optionalString(data.video),
    hideOnResume: data.hideOnResume === true,
  }
  return { meta, content: content.trim() }
}

// 최신순 발표 목록 (본문 제외)
export function getAllTalks(): TalkMetadata[] {
  if (!fs.existsSync(talksDirectory)) return []

  return fs
    .readdirSync(talksDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => parseTalk(fileName).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getTalkBySlug(slug: string): TalkDetail | null {
  const fileName = `${slug}.md`
  if (!fs.existsSync(path.join(talksDirectory, fileName))) return null
  const { meta, content } = parseTalk(fileName)
  return { ...meta, content }
}
