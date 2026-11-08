import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  TALK_CATEGORIES,
  getAllTalks,
  isTalkCategory,
  talkCategoryLabel,
} from '@/lib/talks'
import { getLocale } from '@/lib/locale'
import { TalkCategoryNav, TalkList } from '@/components/TalkList'

interface PageProps {
  params: Promise<{ category: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return TALK_CATEGORIES.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params
  const locale = await getLocale()
  if (!isTalkCategory(category)) {
    return { title: 'Category Not Found' }
  }
  const label = talkCategoryLabel(category, locale)
  return {
    title:
      locale === 'ko'
        ? `${label} 발표 - Yeonguk Choo`
        : `${label} Talks - Yeonguk Choo`,
  }
}

export default async function TalkCategoryPage({ params }: PageProps) {
  const { category } = await params
  if (!isTalkCategory(category)) notFound()

  const locale = await getLocale()
  const talks = getAllTalks()

  return (
    <main className="mt-24 space-y-10 pb-20">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          {locale === 'ko' ? '발표' : 'Talks'}
        </h1>
        <TalkCategoryNav talks={talks} current={category} locale={locale} />
      </div>
      <TalkList
        talks={talks.filter((talk) => talk.category === category)}
        locale={locale}
      />
    </main>
  )
}
