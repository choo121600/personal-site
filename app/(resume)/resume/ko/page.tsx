import { Metadata } from 'next'
import { getResume } from '@/lib/resume'
import { ResumeClient } from '../ResumeClient'

export async function generateMetadata(): Promise<Metadata> {
  const resume = await getResume('ko')
  return {
    title: `${resume.name || '이력서'} - 이력서`,
    description: resume.summary || `${resume.name}의 이력서`,
  }
}

export default async function ResumeKoPage() {
  const resume = await getResume('ko')
  return <ResumeClient resume={resume} locale="ko" />
}
