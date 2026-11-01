// 블로그 카테고리 (client-safe). 글당 하나, 목록은 여기서만 관리한다.

export const CATEGORIES = [
  { slug: 'dev', label: '개발' },
  { slug: 'essay', label: '생각' },
  { slug: 'life', label: '일상' },
  { slug: 'food', label: '맛집' },
  { slug: 'travel', label: '여행' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']

export function isCategory(value: unknown): value is CategorySlug {
  return CATEGORIES.some((category) => category.slug === value)
}

export function categoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((category) => category.slug === slug)!.label
}
