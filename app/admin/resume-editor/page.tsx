'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import type {
  Locale,
  Resume,
  Experience,
  Education,
  Project,
  SkillCategory,
  Certification,
  Award,
  Talk,
  ResumeLink,
} from '@/lib/resume'
import { ResumeClient } from '@/app/(resume)/resume/ResumeClient'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getDefaultResume(): Resume {
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

interface SectionHeaderProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  onAdd: () => void
}

function SectionHeader({ title, isOpen, onToggle, onAdd }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-700">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
      >
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </button>
      <button
        onClick={onAdd}
        className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        <Plus className="h-3 w-3" />
        추가
      </button>
    </div>
  )
}

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  multiline?: boolean
}

function InputField({ label, value, onChange, placeholder, type = 'text', multiline }: InputFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      )}
    </div>
  )
}

interface ArrayInputProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

function ArrayInput({ label, items, onChange, placeholder }: ArrayInputProps) {
  const addItem = () => {
    onChange([...items, ''])
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange(newItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
            <button
              onClick={() => removeItem(index)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          + 항목 추가
        </button>
      </div>
    </div>
  )
}

export default function ResumeEditorPage() {
  const [resume, setResume] = useState<Resume>(getDefaultResume())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [locale, setLocale] = useState<Locale>('en')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    experience: true,
    education: false,
    projects: false,
    skills: false,
    certifications: false,
    awards: false,
    talks: false,
  })

  const loadResume = useCallback(async (targetLocale: Locale) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/admin/api/resume?locale=${targetLocale}`)
      if (response.ok) {
        const data = await response.json()
        setResume(data)
      }
    } catch (error) {
      console.error('Failed to load resume:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadResume(locale)
  }, [locale, loadResume])

  const saveResume = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/admin/api/resume?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      })
      if (response.ok) {
        alert(locale === 'ko' ? '저장되었습니다!' : 'Saved!')
      } else {
        alert(locale === 'ko' ? '저장에 실패했습니다.' : 'Failed to save.')
      }
    } catch (error) {
      console.error('Failed to save resume:', error)
      alert(locale === 'ko' ? '저장 중 오류가 발생했습니다.' : 'Error while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  const switchLocale = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocale(newLocale)
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateBasicInfo = useCallback((field: keyof Resume, value: string | ResumeLink[]) => {
    setResume((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
    }
    setResume((prev) => ({ ...prev, experience: [...prev.experience, newExp] }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setResume((prev) => {
      const newExp = [...prev.experience]
      newExp[index] = { ...newExp[index], [field]: value }
      return { ...prev, experience: newExp }
    })
  }

  const removeExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: [],
    }
    setResume((prev) => ({ ...prev, education: [...prev.education, newEdu] }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string | string[]) => {
    setResume((prev) => {
      const newEdu = [...prev.education]
      newEdu[index] = { ...newEdu[index], [field]: value }
      return { ...prev, education: newEdu }
    })
  }

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  // Project handlers
  const addProject = () => {
    const newProj: Project = {
      id: generateId(),
      name: '',
      description: '',
      url: '',
      startDate: '',
      endDate: '',
      highlights: [],
      technologies: [],
    }
    setResume((prev) => ({ ...prev, projects: [...prev.projects, newProj] }))
  }

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    setResume((prev) => {
      const newProj = [...prev.projects]
      newProj[index] = { ...newProj[index], [field]: value }
      return { ...prev, projects: newProj }
    })
  }

  const removeProject = (index: number) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  // Skills handlers
  const addSkillCategory = () => {
    const newSkill: SkillCategory = {
      category: '',
      items: [],
    }
    setResume((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }))
  }

  const updateSkillCategory = (index: number, field: keyof SkillCategory, value: string | string[]) => {
    setResume((prev) => {
      const newSkills = [...prev.skills]
      newSkills[index] = { ...newSkills[index], [field]: value }
      return { ...prev, skills: newSkills }
    })
  }

  const removeSkillCategory = (index: number) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  // Certification handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    }
    setResume((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }))
  }

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setResume((prev) => {
      const newCerts = [...prev.certifications]
      newCerts[index] = { ...newCerts[index], [field]: value }
      return { ...prev, certifications: newCerts }
    })
  }

  const removeCertification = (index: number) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  // Award handlers
  const addAward = () => {
    const newAward: Award = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      description: '',
    }
    setResume((prev) => ({ ...prev, awards: [...prev.awards, newAward] }))
  }

  const updateAward = (index: number, field: keyof Award, value: string) => {
    setResume((prev) => {
      const newAwards = [...prev.awards]
      newAwards[index] = { ...newAwards[index], [field]: value }
      return { ...prev, awards: newAwards }
    })
  }

  const removeAward = (index: number) => {
    setResume((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }))
  }

  // Talk handlers
  const addTalk = () => {
    const newTalk: Talk = {
      id: generateId(),
      title: '',
      event: '',
      date: '',
      url: '',
      description: '',
    }
    setResume((prev) => ({ ...prev, talks: [...prev.talks, newTalk] }))
  }

  const updateTalk = (index: number, field: keyof Talk, value: string) => {
    setResume((prev) => {
      const newTalks = [...prev.talks]
      newTalks[index] = { ...newTalks[index], [field]: value }
      return { ...prev, talks: newTalks }
    })
  }

  const removeTalk = (index: number) => {
    setResume((prev) => ({
      ...prev,
      talks: prev.talks.filter((_, i) => i !== index),
    }))
  }

  // Link handlers
  const addLink = () => {
    setResume((prev) => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }],
    }))
  }

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    setResume((prev) => {
      const newLinks = [...prev.links]
      newLinks[index] = { ...newLinks[index], [field]: value }
      return { ...prev, links: newLinks }
    })
  }

  const removeLink = (index: number) => {
    setResume((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-500">{locale === 'ko' ? '로딩 중...' : 'Loading...'}</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              {locale === 'ko' ? '이력서 에디터' : 'Resume Editor'}
            </h1>
            {/* Language Switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
              <button
                onClick={() => switchLocale('en')}
                className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale('ko')}
                className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === 'ko'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                한국어
              </button>
            </div>
          </div>
          <button
            onClick={saveResume}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Save className="h-4 w-4" />
            {isSaving ? (locale === 'ko' ? '저장 중...' : 'Saving...') : (locale === 'ko' ? '저장' : 'Save')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div className="w-1/2 overflow-y-auto border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-4">
              <SectionHeader
                title="기본 정보"
                isOpen={openSections.basic}
                onToggle={() => toggleSection('basic')}
                onAdd={() => {}}
              />
              {openSections.basic && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="이름"
                      value={resume.name}
                      onChange={(v) => updateBasicInfo('name', v)}
                      placeholder="홍길동"
                    />
                    <InputField
                      label="직함"
                      value={resume.title}
                      onChange={(v) => updateBasicInfo('title', v)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="이메일"
                      value={resume.email}
                      onChange={(v) => updateBasicInfo('email', v)}
                      placeholder="email@example.com"
                      type="email"
                    />
                    <InputField
                      label="전화번호"
                      value={resume.phone || ''}
                      onChange={(v) => updateBasicInfo('phone', v)}
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <InputField
                    label="위치"
                    value={resume.location || ''}
                    onChange={(v) => updateBasicInfo('location', v)}
                    placeholder="서울, 대한민국"
                  />
                  <InputField
                    label="자기소개"
                    value={resume.summary || ''}
                    onChange={(v) => updateBasicInfo('summary', v)}
                    placeholder="간단한 자기소개를 작성해주세요."
                    multiline
                  />
                  {/* Links */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        링크
                      </label>
                      <button
                        onClick={addLink}
                        className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                      >
                        + 링크 추가
                      </button>
                    </div>
                    <div className="space-y-2">
                      {resume.links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => updateLink(index, 'label', e.target.value)}
                            placeholder="라벨 (예: GitHub)"
                            className="w-1/3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            placeholder="https://"
                            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                          />
                          <button
                            onClick={() => removeLink(index)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Experience */}
            <section className="space-y-4">
              <SectionHeader
                title={`경력 (${resume.experience.length})`}
                isOpen={openSections.experience}
                onToggle={() => toggleSection('experience')}
                onAdd={addExperience}
              />
              {openSections.experience && (
                <div className="space-y-4 pl-6">
                  {resume.experience.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {exp.company || exp.title || `경력 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="회사"
                            value={exp.company}
                            onChange={(v) => updateExperience(index, 'company', v)}
                            placeholder="회사명"
                          />
                          <InputField
                            label="직함"
                            value={exp.title}
                            onChange={(v) => updateExperience(index, 'title', v)}
                            placeholder="직함"
                          />
                        </div>
                        <InputField
                          label="위치"
                          value={exp.location || ''}
                          onChange={(v) => updateExperience(index, 'location', v)}
                          placeholder="서울"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="시작일"
                            value={exp.startDate}
                            onChange={(v) => updateExperience(index, 'startDate', v)}
                            placeholder="2024"
                          />
                          <InputField
                            label="종료일"
                            value={exp.endDate || ''}
                            onChange={(v) => updateExperience(index, 'endDate', v)}
                            placeholder="현재 (비워두면 'Present')"
                          />
                        </div>
                        <InputField
                          label="설명"
                          value={exp.description || ''}
                          onChange={(v) => updateExperience(index, 'description', v)}
                          placeholder="담당 업무 설명"
                          multiline
                        />
                        <ArrayInput
                          label="주요 성과"
                          items={exp.highlights || []}
                          onChange={(v) => updateExperience(index, 'highlights', v)}
                          placeholder="성과 항목"
                        />
                      </div>
                    </div>
                  ))}
                  {resume.experience.length === 0 && (
                    <p className="text-sm text-zinc-500">경력을 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>

            {/* Education */}
            <section className="space-y-4">
              <SectionHeader
                title={`학력 (${resume.education.length})`}
                isOpen={openSections.education}
                onToggle={() => toggleSection('education')}
                onAdd={addEducation}
              />
              {openSections.education && (
                <div className="space-y-4 pl-6">
                  {resume.education.map((edu, index) => (
                    <div
                      key={edu.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {edu.institution || `학력 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <InputField
                          label="학교"
                          value={edu.institution}
                          onChange={(v) => updateEducation(index, 'institution', v)}
                          placeholder="학교명"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="학위"
                            value={edu.degree}
                            onChange={(v) => updateEducation(index, 'degree', v)}
                            placeholder="학사"
                          />
                          <InputField
                            label="전공"
                            value={edu.field || ''}
                            onChange={(v) => updateEducation(index, 'field', v)}
                            placeholder="컴퓨터공학"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="시작일"
                            value={edu.startDate}
                            onChange={(v) => updateEducation(index, 'startDate', v)}
                            placeholder="2020"
                          />
                          <InputField
                            label="졸업일"
                            value={edu.endDate || ''}
                            onChange={(v) => updateEducation(index, 'endDate', v)}
                            placeholder="2024"
                          />
                        </div>
                        <InputField
                          label="GPA"
                          value={edu.gpa || ''}
                          onChange={(v) => updateEducation(index, 'gpa', v)}
                          placeholder="4.0/4.5"
                        />
                        <ArrayInput
                          label="특이사항"
                          items={edu.highlights || []}
                          onChange={(v) => updateEducation(index, 'highlights', v)}
                          placeholder="수상, 활동 등"
                        />
                      </div>
                    </div>
                  ))}
                  {resume.education.length === 0 && (
                    <p className="text-sm text-zinc-500">학력을 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>

            {/* Projects */}
            <section className="space-y-4">
              <SectionHeader
                title={`프로젝트 (${resume.projects.length})`}
                isOpen={openSections.projects}
                onToggle={() => toggleSection('projects')}
                onAdd={addProject}
              />
              {openSections.projects && (
                <div className="space-y-4 pl-6">
                  {resume.projects.map((project, index) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {project.name || `프로젝트 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <InputField
                          label="프로젝트명"
                          value={project.name}
                          onChange={(v) => updateProject(index, 'name', v)}
                          placeholder="프로젝트 이름"
                        />
                        <InputField
                          label="URL"
                          value={project.url || ''}
                          onChange={(v) => updateProject(index, 'url', v)}
                          placeholder="https://"
                        />
                        <InputField
                          label="설명"
                          value={project.description}
                          onChange={(v) => updateProject(index, 'description', v)}
                          placeholder="프로젝트 설명"
                          multiline
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="시작일"
                            value={project.startDate || ''}
                            onChange={(v) => updateProject(index, 'startDate', v)}
                            placeholder="2024"
                          />
                          <InputField
                            label="종료일"
                            value={project.endDate || ''}
                            onChange={(v) => updateProject(index, 'endDate', v)}
                            placeholder="2024"
                          />
                        </div>
                        <ArrayInput
                          label="기술 스택"
                          items={project.technologies || []}
                          onChange={(v) => updateProject(index, 'technologies', v)}
                          placeholder="Python, React, ..."
                        />
                        <ArrayInput
                          label="주요 내용"
                          items={project.highlights || []}
                          onChange={(v) => updateProject(index, 'highlights', v)}
                          placeholder="성과 항목"
                        />
                      </div>
                    </div>
                  ))}
                  {resume.projects.length === 0 && (
                    <p className="text-sm text-zinc-500">프로젝트를 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <SectionHeader
                title={`기술 스택 (${resume.skills.length})`}
                isOpen={openSections.skills}
                onToggle={() => toggleSection('skills')}
                onAdd={addSkillCategory}
              />
              {openSections.skills && (
                <div className="space-y-4 pl-6">
                  {resume.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {skill.category || `카테고리 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSkillCategory(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <InputField
                          label="카테고리"
                          value={skill.category}
                          onChange={(v) => updateSkillCategory(index, 'category', v)}
                          placeholder="Programming Languages"
                        />
                        <ArrayInput
                          label="기술"
                          items={skill.items}
                          onChange={(v) => updateSkillCategory(index, 'items', v)}
                          placeholder="Python, JavaScript, ..."
                        />
                      </div>
                    </div>
                  ))}
                  {resume.skills.length === 0 && (
                    <p className="text-sm text-zinc-500">기술 스택을 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>

            {/* Certifications */}
            <section className="space-y-4">
              <SectionHeader
                title={`자격증 (${resume.certifications.length})`}
                isOpen={openSections.certifications}
                onToggle={() => toggleSection('certifications')}
                onAdd={addCertification}
              />
              {openSections.certifications && (
                <div className="space-y-4 pl-6">
                  {resume.certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {cert.name || `자격증 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <InputField
                          label="자격증명"
                          value={cert.name}
                          onChange={(v) => updateCertification(index, 'name', v)}
                          placeholder="AWS Solutions Architect"
                        />
                        <InputField
                          label="발급 기관"
                          value={cert.issuer}
                          onChange={(v) => updateCertification(index, 'issuer', v)}
                          placeholder="Amazon Web Services"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="취득일"
                            value={cert.date}
                            onChange={(v) => updateCertification(index, 'date', v)}
                            placeholder="2024"
                          />
                          <InputField
                            label="URL"
                            value={cert.url || ''}
                            onChange={(v) => updateCertification(index, 'url', v)}
                            placeholder="https://"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {resume.certifications.length === 0 && (
                    <p className="text-sm text-zinc-500">자격증을 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>

            {/* Awards */}
            <section className="space-y-4">
              <SectionHeader
                title={`수상 (${resume.awards.length})`}
                isOpen={openSections.awards}
                onToggle={() => toggleSection('awards')}
                onAdd={addAward}
              />
              {openSections.awards && (
                <div className="space-y-4 pl-6">
                  {resume.awards.map((award, index) => (
                    <div
                      key={award.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {award.name || `수상 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAward(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <InputField
                          label="수상명"
                          value={award.name}
                          onChange={(v) => updateAward(index, 'name', v)}
                          placeholder="최우수상"
                        />
                        <InputField
                          label="수여 기관"
                          value={award.issuer}
                          onChange={(v) => updateAward(index, 'issuer', v)}
                          placeholder="한국정보통신학회"
                        />
                        <InputField
                          label="수상일"
                          value={award.date}
                          onChange={(v) => updateAward(index, 'date', v)}
                          placeholder="2024"
                        />
                        <InputField
                          label="설명"
                          value={award.description || ''}
                          onChange={(v) => updateAward(index, 'description', v)}
                          placeholder="수상 내용"
                          multiline
                        />
                      </div>
                    </div>
                  ))}
                  {resume.awards.length === 0 && (
                    <p className="text-sm text-zinc-500">수상 경력을 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>

            {/* Talks */}
            <section className="space-y-4">
              <SectionHeader
                title={`발표/강연 (${resume.talks.length})`}
                isOpen={openSections.talks}
                onToggle={() => toggleSection('talks')}
                onAdd={addTalk}
              />
              {openSections.talks && (
                <div className="space-y-4 pl-6">
                  {resume.talks.map((talk, index) => (
                    <div
                      key={talk.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-move text-zinc-400" />
                          <span className="text-sm font-medium">
                            {talk.title || `발표 ${index + 1}`}
                          </span>
                        </div>
                        <button
                          onClick={() => removeTalk(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <InputField
                          label="제목"
                          value={talk.title}
                          onChange={(v) => updateTalk(index, 'title', v)}
                          placeholder="발표 제목"
                        />
                        <InputField
                          label="행사/장소"
                          value={talk.event}
                          onChange={(v) => updateTalk(index, 'event', v)}
                          placeholder="PyCon Korea 2024"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="날짜"
                            value={talk.date}
                            onChange={(v) => updateTalk(index, 'date', v)}
                            placeholder="2024"
                          />
                          <InputField
                            label="URL"
                            value={talk.url || ''}
                            onChange={(v) => updateTalk(index, 'url', v)}
                            placeholder="https://"
                          />
                        </div>
                        <InputField
                          label="설명"
                          value={talk.description || ''}
                          onChange={(v) => updateTalk(index, 'description', v)}
                          placeholder="발표 내용 요약"
                          multiline
                        />
                      </div>
                    </div>
                  ))}
                  {resume.talks.length === 0 && (
                    <p className="text-sm text-zinc-500">발표/강연을 추가해주세요.</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 overflow-y-auto bg-zinc-100 p-6 dark:bg-zinc-950">
          <h2 className="mb-4 text-center text-sm font-medium text-zinc-500">
            {locale === 'ko' ? '미리보기' : 'Preview'}
          </h2>
          <div className="flex justify-center">
            <div className="origin-top" style={{ transform: 'scale(0.75)' }}>
              <ResumeClient resume={resume} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
