import { NextResponse } from 'next/server'
import { getResume, saveResume, type Resume, type Locale } from '@/lib/resume'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = (searchParams.get('locale') as Locale) || 'en'
    const resume = await getResume(locale)
    return NextResponse.json(resume)
  } catch (error) {
    console.error('Failed to get resume:', error)
    return NextResponse.json({ error: 'Failed to get resume' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = (searchParams.get('locale') as Locale) || 'en'
    const data: Resume = await request.json()
    await saveResume(data, locale)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save resume:', error)
    return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 })
  }
}
