// 유튜브 URL 판별 (서버/클라이언트 공용)

// 유튜브 URL에서 비디오 ID 추출
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// URL이 유튜브 URL인지 확인
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}
