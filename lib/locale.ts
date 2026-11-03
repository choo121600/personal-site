import { cookies, headers } from 'next/headers'

export async function getLocale(): Promise<'ko' | 'en'> {
  const resumeLocale = (await headers()).get('x-resume-locale')
  if (resumeLocale === 'ko' || resumeLocale === 'en') return resumeLocale
  const cookieStore = await cookies()
  return cookieStore.get('site-locale')?.value === 'ko' ? 'ko' : 'en'
}
