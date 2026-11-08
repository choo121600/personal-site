// Talk types and formatting (client-safe, no Node.js dependencies)

import type { Locale } from './resume-types'

export const TALK_TYPES = [
  { value: 'talk', label: '발표' },
  { value: 'workshop', label: '워크숍' },
] as const

export type TalkType = (typeof TALK_TYPES)[number]['value']

// 발표 주제 카테고리. 발표당 하나, 목록은 여기서만 관리한다
export const TALK_CATEGORIES = [
  { slug: 'intro', label: '입문', labelEn: 'Intro' },
  { slug: 'contribution', label: '기여·오픈소스', labelEn: 'Contributing' },
  { slug: 'tech', label: '기술', labelEn: 'Tech' },
  { slug: 'community', label: '커뮤니티', labelEn: 'Community' },
] as const

export type TalkCategory = (typeof TALK_CATEGORIES)[number]['slug']

export function isTalkCategory(value: unknown): value is TalkCategory {
  return TALK_CATEGORIES.some((category) => category.slug === value)
}

export function talkCategoryLabel(slug: TalkCategory, locale: Locale): string {
  const category = TALK_CATEGORIES.find((c) => c.slug === slug)!
  return locale === 'en' ? category.labelEn : category.label
}

export interface TalkMetadata {
  slug: string
  title: string
  titleEn?: string
  event: string
  eventEn?: string
  // 'YYYY', 'YYYY-MM' 또는 'YYYY-MM-DD'
  date: string
  type: TalkType
  category?: TalkCategory
  description: string
  descriptionKo?: string
  language?: Locale
  eventUrl?: string
  slides?: string
  video?: string
  hideOnResume: boolean
}

export interface TalkDetail extends TalkMetadata {
  content: string
  contentEn?: string
}

// 파일 이름으로 쓰이므로 경로 문자가 들어가지 않게 제한한다
export const TALK_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const TALK_DATE_PATTERN = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/

const EN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// 'YYYY[-MM[-DD]]' → '2026' / 'Feb 2026' (withDay면 일까지)
export function formatTalkDate(
  date: string,
  locale: Locale,
  withDay = false,
): string {
  const match = date.match(TALK_DATE_PATTERN)
  if (!match) return date

  const year = match[1]
  if (!match[2]) return locale === 'ko' ? `${year}년` : year
  const month = Number(match[2])
  const day = withDay && match[3] ? Number(match[3]) : null

  if (locale === 'ko') {
    return day ? `${year}년 ${month}월 ${day}일` : `${year}년 ${month}월`
  }
  const monthName = EN_MONTHS[month - 1]
  return day ? `${monthName} ${day}, ${year}` : `${monthName} ${year}`
}
