import { Metadata } from 'next'
import { getResume } from '@/lib/resume'
import { ResumeClient } from './ResumeClient'

export async function generateMetadata(): Promise<Metadata> {
  const resume = await getResume()
  return {
    title: `${resume.name || 'Resume'} - Resume`,
    description: resume.summary || `${resume.name}'s professional resume`,
  }
}

export default async function ResumePage() {
  const resume = await getResume('en')
  return <ResumeClient resume={resume} locale="en" />
}
