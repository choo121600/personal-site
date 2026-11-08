import type { Metadata } from 'next'
import { getAllTalks } from '@/lib/talks'
import { getLocale } from '@/lib/locale'
import { TalkCategoryNav, TalkList } from '@/components/TalkList'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return locale === 'ko'
    ? {
        title: '발표 - Yeonguk Choo',
        description: '추영욱의 발표 및 워크숍.',
      }
    : {
        title: 'Talks - Yeonguk Choo',
        description: 'Talks and workshops by Yeonguk Choo.',
      }
}

export default async function TalksPage() {
  const locale = await getLocale()
  const talks = getAllTalks()

  return (
    <main className="mt-24 space-y-10 pb-20">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          {locale === 'ko' ? '발표' : 'Talks'}
        </h1>
        {talks.length > 0 && <TalkCategoryNav talks={talks} locale={locale} />}
      </div>
      <TalkList talks={talks} locale={locale} />
    </main>
  )
}
