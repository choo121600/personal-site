// Talk types and formatting (client-safe, no Node.js dependencies)

import type { Locale } from './resume-types'

export const TALK_TYPES = [
  { value: 'talk', label: '발표' },
  { value: 'workshop', label: '워크숍' },
] as const

export type TalkType = (typeof TALK_TYPES)[number]['value']

export interface TalkMetadata {
  slug: string
  title: string
  event: string
  // 'YYYY-MM' 또는 'YYYY-MM-DD'
  date: string
  type: TalkType
  description: string
  descriptionKo?: string
  eventUrl?: string
  slides?: string
  video?: string
  hideOnResume: boolean
}

export interface TalkDetail extends TalkMetadata {
  content: string
}

// 파일 이름으로 쓰이므로 경로 문자가 들어가지 않게 제한한다
export const TALK_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const TALK_DATE_PATTERN = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/

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

// 'YYYY-MM[-DD]' → 'Feb 2026' / '2026년 2월' (withDay면 일까지)
export function formatTalkDate(
  date: string,
  locale: Locale,
  withDay = false,
): string {
  const match = date.match(TALK_DATE_PATTERN)
  if (!match) return date

  const year = match[1]
  const month = Number(match[2])
  const day = withDay && match[3] ? Number(match[3]) : null

  if (locale === 'ko') {
    return day ? `${year}년 ${month}월 ${day}일` : `${year}년 ${month}월`
  }
  const monthName = EN_MONTHS[month - 1]
  return day ? `${monthName} ${day}, ${year}` : `${monthName} ${year}`
}
