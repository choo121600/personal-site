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

import type { Resume, Locale } from './resume-types'

function getResumePath(locale: Locale = 'en'): string {
  const filename = locale === 'en' ? 'resume.json' : `resume.${locale}.json`
  return path.join(process.cwd(), 'content', filename)
}

export async function getResume(locale: Locale = 'en'): Promise<Resume> {
  try {
    const content = fs.readFileSync(getResumePath(locale), 'utf-8')
    return JSON.parse(content) as Resume
  } catch {
    // Return default empty resume if file doesn't exist
    return getDefaultResume()
  }
}

export async function saveResume(data: Resume, locale: Locale = 'en'): Promise<void> {
  const resumePath = getResumePath(locale)
  const dir = path.dirname(resumePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(resumePath, JSON.stringify(data, null, 2), 'utf-8')
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
