import fs from 'fs'
import path from 'path'

// Resume types
export interface ResumeLink {
  label: string
  url: string
}

export interface Experience {
  id: string
  company: string
  title: string
  location?: string
  startDate: string
  endDate?: string
  description?: string
  highlights?: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate?: string
  gpa?: string
  highlights?: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  url?: string
  startDate?: string
  endDate?: string
  highlights?: string[]
  technologies?: string[]
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface Award {
  id: string
  name: string
  issuer: string
  date: string
  description?: string
}

export interface Talk {
  id: string
  title: string
  event: string
  date: string
  url?: string
  description?: string
}

export interface Resume {
  name: string
  title: string
  email: string
  phone?: string
  location?: string
  summary?: string
  links: ResumeLink[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: SkillCategory[]
  certifications: Certification[]
  awards: Award[]
  talks: Talk[]
}

export type Locale = 'en' | 'ko'

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
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
