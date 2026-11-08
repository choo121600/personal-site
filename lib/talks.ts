import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  TALK_DATE_PATTERN,
  TALK_SLUG_PATTERN,
  TALK_TYPES,
  TALK_CATEGORIES,
  isTalkCategory,
  type TalkDetail,
  type TalkMetadata,
  type TalkType,
} from './talk-types'

export type {
  TalkCategory,
  TalkDetail,
  TalkMetadata,
  TalkType,
} from './talk-types'
export {
  TALK_CATEGORIES,
  formatTalkDate,
  isTalkCategory,
  talkCategoryLabel,
} from './talk-types'

const talksDirectory = path.join(process.cwd(), 'content', 'talks')

// frontmatter에 쓰는 선택 필드. 비어 있으면 파일에서 뺀다
const OPTIONAL_FIELDS = [
  'titleEn',
  'eventEn',
  'category',
  'descriptionKo',
  'language',
  'eventUrl',
  'slides',
  'video',
] as const

export class TalkValidationError extends Error {}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : undefined
}

function optionalLanguage(
  value: unknown,
  source: string,
): TalkMetadata['language'] {
  if (value === undefined) return undefined
  if (typeof value !== 'string') {
    throw new TalkValidationError(`${source}: 'language' must be 'ko' or 'en'`)
  }

  const language = value.trim()
  if (!language) return undefined
  if (language !== 'ko' && language !== 'en') {
    throw new TalkValidationError(`${source}: 'language' must be 'ko' or 'en'`)
  }
  return language
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  source: string,
) {
  const value = optionalString(data[key])
  if (!value) {
    throw new TalkValidationError(`${source}: '${key}' is required`)
  }
  return value
}

function talkPath(slug: string, source: string) {
  if (!TALK_SLUG_PATTERN.test(slug)) {
    throw new TalkValidationError(
      `${source}: slug must be lowercase letters, digits and hyphens, got '${slug}'`,
    )
  }
  return path.join(talksDirectory, `${slug}.md`)
}

// frontmatter → TalkMetadata. 파일을 읽을 때와 저장할 때 같은 규칙으로 검사한다
function toTalkMetadata(
  slug: string,
  data: Record<string, unknown>,
  source: string,
): TalkMetadata {
  // 따옴표 없이 쓴 YAML 날짜는 Date 객체로 파싱된다
  const rawDate =
    data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date
  const date = requireString({ date: rawDate }, 'date', source)
  if (!TALK_DATE_PATTERN.test(date)) {
    throw new TalkValidationError(
      `${source}: 'date' must be YYYY, YYYY-MM or YYYY-MM-DD, got '${date}'`,
    )
  }

  const type = data.type ?? 'talk'
  if (!TALK_TYPES.some((t) => t.value === type)) {
    throw new TalkValidationError(
      `${source}: 'type' must be one of ${TALK_TYPES.map((t) => t.value).join(', ')}`,
    )
  }

  const category = optionalString(data.category)
  if (category !== undefined && !isTalkCategory(category)) {
    throw new TalkValidationError(
      `${source}: 'category' must be one of ${TALK_CATEGORIES.map((c) => c.slug).join(', ')}`,
    )
  }

  return {
    slug,
    title: requireString(data, 'title', source),
    titleEn: optionalString(data.titleEn),
    event: requireString(data, 'event', source),
    eventEn: optionalString(data.eventEn),
    date,
    type: type as TalkType,
    category,
    description: requireString(data, 'description', source),
    descriptionKo: optionalString(data.descriptionKo),
    language: optionalLanguage(data.language, source),
    eventUrl: optionalString(data.eventUrl),
    slides: optionalString(data.slides),
    video: optionalString(data.video),
    hideOnResume: data.hideOnResume === true,
  }
}

function readTalk(slug: string): TalkDetail {
  const source = `content/talks/${slug}.md`
  const { data, content } = matter(
    fs.readFileSync(talkPath(slug, source), 'utf8'),
  )
  return {
    ...toTalkMetadata(slug, data, source),
    content: content.trim(),
    contentEn: optionalString(data.contentEn),
  }
}

// 최신순 발표 목록 (본문 제외)
export function getAllTalks(): TalkMetadata[] {
  if (!fs.existsSync(talksDirectory)) return []

  return fs
    .readdirSync(talksDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const talk: TalkMetadata &
        Partial<Pick<TalkDetail, 'content' | 'contentEn'>> = readTalk(
        fileName.replace(/\.md$/, ''),
      )
      delete talk.content
      delete talk.contentEn
      return talk
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getTalkBySlug(slug: string): TalkDetail | null {
  if (!TALK_SLUG_PATTERN.test(slug)) return null
  if (!fs.existsSync(path.join(talksDirectory, `${slug}.md`))) return null
  return readTalk(slug)
}

// 발표 저장. 잘못된 값이면 TalkValidationError를 던지고 파일은 건드리지 않는다
export function saveTalk(talk: TalkDetail): void {
  const filePath = talkPath(talk.slug, 'talk')
  const meta = toTalkMetadata(
    talk.slug,
    talk as unknown as Record<string, unknown>,
    'talk',
  )

  // 에디터가 다루지 않는 frontmatter 필드는 기존 파일 값을 유지한다
  const existing = fs.existsSync(filePath)
    ? matter(fs.readFileSync(filePath, 'utf8')).data
    : {}
  const frontmatter: Record<string, unknown> = {
    ...existing,
    title: meta.title,
    event: meta.event,
    date: meta.date,
    type: meta.type,
    description: meta.description,
  }
  for (const key of OPTIONAL_FIELDS) {
    if (meta[key]) frontmatter[key] = meta[key]
    else delete frontmatter[key]
  }
  const contentEn = optionalString(talk.contentEn)
  if (contentEn) frontmatter.contentEn = contentEn
  else delete frontmatter.contentEn
  if (meta.hideOnResume) frontmatter.hideOnResume = true
  else delete frontmatter.hideOnResume

  fs.mkdirSync(talksDirectory, { recursive: true })
  const body = (talk.content ?? '').trim()
  // 본문이 없을 때 matter가 붙이는 빈 줄은 떼어 낸다
  const file = matter.stringify(body, frontmatter).replace(/\n+$/, '\n')
  fs.writeFileSync(filePath, file, 'utf8')
}

export function talkExists(slug: string): boolean {
  return fs.existsSync(path.join(talksDirectory, `${slug}.md`))
}

export function deleteTalk(slug: string): boolean {
  if (!TALK_SLUG_PATTERN.test(slug)) return false
  const filePath = path.join(talksDirectory, `${slug}.md`)
  if (!fs.existsSync(filePath)) return false
  fs.unlinkSync(filePath)
  return true
}
