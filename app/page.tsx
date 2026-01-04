import { getAllPosts } from '@/lib/posts'
import HomeClient from './HomeClient'

export default function Home() {
  // 최신 3개 포스트만 가져오기
  const latestPosts = getAllPosts().slice(0, 3)

  return <HomeClient latestPosts={latestPosts} />
}
