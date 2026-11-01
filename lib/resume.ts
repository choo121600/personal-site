import fs from 'fs'
import path from 'path'

// Re-export all types from client-safe module
export type {
  ResumeLink,
  Experience,
  Education,
  Project,
  SkillCategory,
  Certification,
  Award,
  Talk,
  Community,
  SectionKey,
  Resume,
  Locale,
} from './resume-types'
export { DEFAULT_SECTION_ORDER } from './resume-types'

import type { Resume, Locale, Talk } from './resume-types'
import { getAllTalks, formatTalkDate } from './talks'

// 발표는 content/talks/*.md가 원본이라 resume JSON에는 저장하지 않는다
type StoredResume = Omit<Resume, 'talks'>

function getResumePath(locale: Locale = 'en'): string {
  const filename = locale === 'en' ? 'resume.json' : `resume.${locale}.json`
  return path.join(process.cwd(), 'content', filename)
}

function getResumeTalks(locale: Locale): Talk[] {
  return getAllTalks()
    .filter((talk) => !talk.hideOnResume)
    .map((talk) => ({
      id: talk.slug,
      title: talk.title,
      event: talk.event,
      date: formatTalkDate(talk.date, locale),
      url: talk.eventUrl,
      description:
        locale === 'ko' && talk.descriptionKo
          ? talk.descriptionKo
          : talk.description,
    }))
}

function stripTalks(resume: Resume): StoredResume {
  const stored: StoredResume & { talks?: Talk[] } = { ...resume }
  delete stored.talks
  return stored
}

function readStoredResume(locale: Locale): StoredResume {
  const resumePath = getResumePath(locale)
  if (!fs.existsSync(resumePath)) return stripTalks(getDefaultResume())
  return JSON.parse(fs.readFileSync(resumePath, 'utf-8')) as StoredResume
}

export async function getResume(locale: Locale = 'en'): Promise<Resume> {
  return { ...readStoredResume(locale), talks: getResumeTalks(locale) }
}

export async function saveResume(
  data: Resume,
  locale: Locale = 'en',
): Promise<void> {
  const resumePath = getResumePath(locale)
  const dir = path.dirname(resumePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(
    resumePath,
    JSON.stringify(stripTalks(data), null, 2),
    'utf-8',
  )
}

export function getDefaultResume(): Resume {
  return {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    links: [],
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    awards: [],
    talks: [],
    community: [],
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
