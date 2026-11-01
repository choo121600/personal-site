// 제목 → URL 슬러그. 한글은 국어의 로마자 표기법(음운 변화 제외)으로 옮긴다.
// 예: '일월카츠 용산점 후기' → 'irwolkacheu-yongsanjeom-hugi'

const INITIALS = [
  'g',
  'kk',
  'n',
  'd',
  'tt',
  'r',
  'm',
  'b',
  'pp',
  's',
  'ss',
  '',
  'j',
  'jj',
  'ch',
  'k',
  't',
  'p',
  'h',
]
const MEDIALS = [
  'a',
  'ae',
  'ya',
  'yae',
  'eo',
  'e',
  'yeo',
  'ye',
  'o',
  'wa',
  'wae',
  'oe',
  'yo',
  'u',
  'wo',
  'we',
  'wi',
  'yu',
  'eu',
  'ui',
  'i',
]
const FINALS = [
  '',
  'k',
  'k',
  'k',
  'n',
  'n',
  'n',
  't',
  'l',
  'k',
  'm',
  'l',
  'l',
  'l',
  'p',
  'l',
  'm',
  'p',
  'p',
  't',
  't',
  'ng',
  't',
  't',
  'k',
  't',
  'p',
  't',
]
const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3
const MAX_LENGTH = 60

function romanizeSyllable(code: number): string {
  const index = code - HANGUL_START
  const initial = Math.floor(index / 588)
  const medial = Math.floor((index % 588) / 28)
  const final = index % 28
  return INITIALS[initial] + MEDIALS[medial] + FINALS[final]
}

function romanize(text: string): string {
  let result = ''
  for (const char of text) {
    const code = char.codePointAt(0)!
    result +=
      code >= HANGUL_START && code <= HANGUL_END ? romanizeSyllable(code) : char
  }
  return result
}

export function slugify(title: string): string {
  // 로마자로 옮긴 뒤 악센트를 뗀다 (Café → cafe)
  const words = romanize(title.normalize('NFC'))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

  // 단어 경계에서 자른다
  let slug = ''
  for (const word of words) {
    const next = slug ? `${slug}-${word}` : word
    if (next.length > MAX_LENGTH) break
    slug = next
  }
  return slug || words[0]?.slice(0, MAX_LENGTH) || ''
}

// 이미 있는 슬러그와 겹치면 -2, -3 … 을 붙인다
export function uniqueSlug(base: string, exists: (slug: string) => boolean) {
  if (!exists(base)) return base
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`
    if (!exists(candidate)) return candidate
  }
}
