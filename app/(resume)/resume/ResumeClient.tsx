'use client'

import { Download, Mail, MapPin, Phone, Github, Linkedin, Globe, Languages } from 'lucide-react'
import Link from 'next/link'
import type { Resume, Locale, SectionKey } from '@/lib/resume-types'
import { DEFAULT_SECTION_ORDER } from '@/lib/resume-types'

interface ResumeClientProps {
  resume: Resume
  locale?: Locale
}

function renderTextWithLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900 print:text-zinc-700 print:no-underline"
        >
          {match[1]}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function getLinkIcon(label: string) {
  const lower = label.toLowerCase()
  if (lower.includes('github')) return <Github className="h-4 w-4" />
  if (lower.includes('linkedin')) return <Linkedin className="h-4 w-4" />
  return <Globe className="h-4 w-4" />
}

const labels = {
  en: {
    download: 'Download PDF',
    switchLang: '한국어',
    switchLangPath: '/resume/ko',
    summary: 'Summary',
    experience: 'Professional Experience',
    skills: 'Technical Skills',
    projects: 'Projects',
    education: 'Education',
    certifications: 'Certifications',
    presentations: 'Presentations',
    awards: 'Awards',
    community: 'Community & Leadership',
    present: 'Present',
    technologies: 'Technologies',
    inField: 'in',
    gpa: 'GPA',
  },
  ko: {
    download: 'PDF 다운로드',
    switchLang: 'English',
    switchLangPath: '/resume',
    summary: '요약',
    experience: '경력',
    skills: '기술 스택',
    projects: '프로젝트',
    education: '학력',
    certifications: '자격증',
    presentations: '발표',
    awards: '수상',
    community: '커뮤니티 & 리더십',
    present: '현재',
    technologies: '기술',
    inField: '',
    gpa: '학점',
  },
}

export function ResumeClient({ resume, locale = 'en' }: ResumeClientProps) {
  const t = labels[locale]

  const handlePrint = () => {
    window.print()
  }

  const formatDateRange = (start?: string, end?: string) => {
    if (!start) return ''
    const endText = end || t.present
    return `${start} - ${endText}`
  }

  return (
    <div className="resume-wrapper">
      {/* Print and Language buttons */}
      <div className="mb-6 flex justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Download className="h-4 w-4" />
          {t.download}
        </button>
        <Link
          href={t.switchLangPath}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          <Languages className="h-4 w-4" />
          {t.switchLang}
        </Link>
      </div>

      {/* A4 Page - Conservative Single Column ATS-Optimized */}
      <div className="a4-page mx-auto bg-white px-16 py-12 shadow-2xl print:px-0 print:py-0 print:shadow-none">

        {/* Header */}
        <header className="text-center border-b border-zinc-300 pb-4">
          <h1 className="text-2xl font-bold text-zinc-900">
            {resume.name}
          </h1>
          {resume.title && (
            <p className="mt-1 text-base text-zinc-600">
              {resume.title}
            </p>
          )}

          {/* Contact - Single line, centered */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-zinc-600">
            {resume.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {resume.email}
              </span>
            )}
            {resume.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {resume.phone}
              </span>
            )}
            {resume.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {resume.location}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-center gap-4 text-sm text-zinc-600">
            {resume.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-zinc-900"
              >
                {getLinkIcon(link.label)}
                {link.url.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="mt-5 space-y-5">

          {/* Summary */}
          {resume.summary && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">
                {t.summary}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                {resume.summary}
              </p>
            </section>
          )}

          {(resume.sectionOrder ?? DEFAULT_SECTION_ORDER).map((key) => {
            const renderers: Record<SectionKey, () => React.ReactNode> = {
              experience: () => resume.experience.length > 0 ? (
                <section key="experience">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.experience}</h2>
                  <div className="mt-3 space-y-4">
                    {resume.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-zinc-900">{exp.company}</h3>
                            <p className="text-sm text-zinc-600">{exp.title}{exp.location && ` | ${exp.location}`}</p>
                          </div>
                          <span className="text-sm text-zinc-500 whitespace-nowrap">{formatDateRange(exp.startDate, exp.endDate)}</span>
                        </div>
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="mt-1.5 space-y-1 text-sm text-zinc-700">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="flex">
                                <span className="mr-2 text-zinc-400">•</span>
                                <span>{renderTextWithLinks(highlight)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              skills: () => resume.skills.length > 0 ? (
                <section key="skills">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.skills}</h2>
                  <div className="mt-2 space-y-1">
                    {resume.skills.map((skillGroup, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-semibold text-zinc-800">{skillGroup.category}: </span>
                        <span className="text-zinc-700">{skillGroup.items.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              projects: () => resume.projects.length > 0 ? (
                <section key="projects">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.projects}</h2>
                  <div className="mt-3 space-y-3">
                    {resume.projects.map((project) => (
                      <div key={project.id}>
                        <h3 className="text-sm font-bold text-zinc-900">
                          {project.name}
                          {project.url && <span className="font-normal text-zinc-500"> - {project.url}</span>}
                        </h3>
                        <p className="text-sm text-zinc-700">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <p className="mt-0.5 text-sm text-zinc-500">{t.technologies}: {project.technologies.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              education: () => resume.education.length > 0 ? (
                <section key="education">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.education}</h2>
                  <div className="mt-3 space-y-2">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900">{edu.institution}</h3>
                          <p className="text-sm text-zinc-600">
                            {locale === 'ko' ? `${edu.field ? `${edu.field} ` : ''}${edu.degree}` : `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`}
                            {edu.gpa && ` | ${t.gpa}: ${edu.gpa}`}
                          </p>
                        </div>
                        <span className="text-sm text-zinc-500 whitespace-nowrap">{formatDateRange(edu.startDate, edu.endDate)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              certifications: () => resume.certifications.length > 0 ? (
                <section key="certifications">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.certifications}</h2>
                  <div className="mt-2 space-y-1">
                    {resume.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start justify-between text-sm">
                        <div>
                          <span className="font-semibold text-zinc-800">{cert.name}</span>
                          <span className="text-zinc-600"> - {cert.issuer}</span>
                        </div>
                        <span className="text-zinc-500">{cert.date}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              talks: () => resume.talks.length > 0 ? (
                <section key="talks">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.presentations}</h2>
                  <div className="mt-3 space-y-4">
                    {resume.talks.map((talk) => (
                      <div key={talk.id} className="text-sm">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-zinc-900">{talk.title}</h3>
                          <span className="text-zinc-500 whitespace-nowrap">{talk.date}</span>
                        </div>
                        <p className="text-zinc-600">{talk.event}</p>
                        {talk.description && <p className="mt-0.5 text-zinc-600">{talk.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              awards: () => resume.awards.length > 0 ? (
                <section key="awards">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.awards}</h2>
                  <div className="mt-2 space-y-1">
                    {resume.awards.map((award) => (
                      <div key={award.id} className="flex items-start justify-between text-sm">
                        <div>
                          <span className="font-semibold text-zinc-800">{award.name}</span>
                          <span className="text-zinc-600"> - {award.issuer}</span>
                        </div>
                        <span className="text-zinc-500">{award.date}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
              community: () => resume.community && resume.community.length > 0 ? (
                <section key="community">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 border-b border-zinc-200 pb-1">{t.community}</h2>
                  <div className="mt-3 space-y-4">
                    {resume.community.map((item) => (
                      <div key={item.id}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-zinc-900">{item.organization}</h3>
                            <p className="text-sm text-zinc-600">{item.role}</p>
                          </div>
                          <span className="text-sm text-zinc-500 whitespace-nowrap">{formatDateRange(item.startDate, item.endDate)}</span>
                        </div>
                        {item.description && <p className="mt-1 text-sm text-zinc-700">{item.description}</p>}
                        {item.highlights && item.highlights.length > 0 && (
                          <ul className="mt-1.5 space-y-1 text-sm text-zinc-700">
                            {item.highlights.map((highlight, i) => (
                              <li key={i} className="flex">
                                <span className="mr-2 text-zinc-400">•</span>
                                <span>{renderTextWithLinks(highlight)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
            }
            return renderers[key]?.()
          })}

        </main>
      </div>
    </div>
  )
}
