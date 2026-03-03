// Resume types (client-safe, no Node.js dependencies)

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
  technologies?: string[]
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

export interface Community {
  id: string
  organization: string
  role: string
  startDate: string
  endDate?: string
  description?: string
  highlights?: string[]
}

export type SectionKey = 'experience' | 'education' | 'projects' | 'skills' | 'certifications' | 'awards' | 'talks' | 'community'

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'experience', 'skills', 'projects', 'education', 'certifications', 'talks', 'awards', 'community',
]

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
  community: Community[]
  sectionOrder?: SectionKey[]
}

export type Locale = 'en' | 'ko'
