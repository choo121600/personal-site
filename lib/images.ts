import fs from 'fs'
import path from 'path'

const imagesDirectory = path.join(process.cwd(), 'public', 'images')

// 이미지 디렉토리 구조 생성 (YYYY/MM)
export function getImageDirectory(): string {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const dir = path.join(imagesDirectory, year, month)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  return dir
}

// 이미지 경로 생성 (public 기준)
export function getImagePath(filename: string): string {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `/images/${year}/${month}/${filename}`
}

// 이미지 저장
export function saveImage(buffer: Buffer, filename: string): string {
  const dir = getImageDirectory()
  const fullPath = path.join(dir, filename)
  
  fs.writeFileSync(fullPath, buffer)
  
  return getImagePath(filename)
}

// 고유한 파일명 생성
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const baseName = path.basename(originalName, ext)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  
  return `${baseName}-${timestamp}-${random}${ext}`
}


