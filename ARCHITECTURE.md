# 블로그 에디터 시스템 아키텍처

## 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    클라이언트 (브라우저)                    │
│                                                           │
│  /admin/editor                                           │
│  ├── CodeMirror 에디터 (마크다운 작성)                    │
│  ├── 실시간 미리보기 (ReactMarkdown)                      │
│  └── 이미지 붙여넣기 처리                                 │
└─────────────────────────────────────────────────────────┘
                        ↕ HTTP API
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                     │
│                                                           │
│  /admin/api/posts                                        │
│  ├── GET    → 포스트 목록/상세 조회                       │
│  ├── POST   → 포스트 저장                                │
│  └── DELETE → 포스트 삭제                                │
│                                                           │
│  /admin/api/images                                       │
│  └── POST   → 이미지 업로드                              │
└─────────────────────────────────────────────────────────┘
                        ↕ File System
┌─────────────────────────────────────────────────────────┐
│                    파일 시스템                            │
│                                                           │
│  content/posts/                                          │
│  └── [slug].md  (마크다운 + frontmatter)                 │
│                                                           │
│  public/images/YYYY/MM/                                   │
│  └── [filename]  (업로드된 이미지)                       │
└─────────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────────┐
│              블로그 포스트 표시 (SSR)                     │
│                                                           │
│  /blog/[slug]                                            │
│  └── getPostBySlug() → ReactMarkdown 렌더링              │
└─────────────────────────────────────────────────────────┘
```

## 핵심 컴포넌트

### 1. 라이브러리 유틸리티 (`lib/posts.ts`)

**기능:**
- `getAllPosts()`: 모든 포스트 메타데이터 조회
- `getPostBySlug()`: 특정 포스트 조회
- `savePost()`: 포스트 저장 (frontmatter 자동 생성)
- `deletePost()`: 포스트 삭제

**특징:**
- `gray-matter`로 frontmatter 파싱
- 자동 디렉토리 생성
- 날짜별 정렬

### 2. 이미지 유틸리티 (`lib/images.ts`)

**기능:**
- `getImageDirectory()`: 연도/월별 디렉토리 생성
- `saveImage()`: 이미지 파일 저장
- `generateUniqueFilename()`: 고유 파일명 생성

**특징:**
- 자동 경로 생성: `public/images/YYYY/MM/`
- 파일명 충돌 방지 (타임스탬프 + 랜덤)

### 3. API 라우트

#### `/admin/api/posts` (route.ts)

```typescript
GET    /admin/api/posts?slug=xxx  → 포스트 상세
GET    /admin/api/posts            → 포스트 목록
POST   /admin/api/posts            → 포스트 저장
DELETE /admin/api/posts?slug=xxx  → 포스트 삭제
```

#### `/admin/api/images` (route.ts)

```typescript
POST   /admin/api/images           → 이미지 업로드
```

**요청 형식:**
```javascript
FormData {
  file: File
}
```

**응답 형식:**
```json
{
  "success": true,
  "path": "/images/2024/01/image-1234567890-abc123.jpg"
}
```

### 4. 에디터 페이지 (`app/admin/editor/page.tsx`)

**주요 기능:**
- CodeMirror 기반 마크다운 에디터
- 실시간 미리보기 (ReactMarkdown)
- 이미지 붙여넣기 자동 처리
- 포스트 목록 사이드바
- 메타데이터 편집 (제목, 설명, 날짜)

**이미지 처리 흐름:**
```
1. 사용자가 이미지 붙여넣기 (Ctrl+V)
2. handlePaste() 이벤트 감지
3. File 객체 추출
4. FormData로 /admin/api/images에 POST
5. 서버에서 public/images/YYYY/MM/에 저장
6. 응답으로 받은 경로를 마크다운 형식으로 삽입
   → ![filename](/images/2024/01/image.jpg)
```

### 5. 블로그 포스트 페이지 (`app/blog/[slug]/page.tsx`)

**특징:**
- Next.js App Router 동적 라우팅
- SSR (Server-Side Rendering)
- `generateStaticParams()`로 정적 경로 생성
- `generateMetadata()`로 SEO 메타데이터 생성

## 데이터 흐름

### 포스트 작성 흐름

```
1. 사용자가 에디터에서 마크다운 작성
   ↓
2. "저장" 버튼 클릭
   ↓
3. POST /admin/api/posts
   {
     slug: "my-post",
     content: "# Title\n...",
     metadata: { title, description, date }
   }
   ↓
4. savePost() 함수 실행
   ↓
5. gray-matter로 frontmatter 생성
   ↓
6. content/posts/my-post.md 파일 저장
   ↓
7. Next.js Hot Reload로 자동 반영
   ↓
8. /blog/my-post 페이지에서 즉시 확인 가능
```

### 이미지 업로드 흐름

```
1. 사용자가 이미지 복사 (클립보드)
   ↓
2. 에디터에 붙여넣기 (Ctrl+V)
   ↓
3. handlePaste() 이벤트 발생
   ↓
4. File 객체 추출
   ↓
5. FormData 생성 및 POST /admin/api/images
   ↓
6. 서버에서:
   - 고유 파일명 생성
   - public/images/2024/01/ 경로에 저장
   - 경로 반환
   ↓
7. 클라이언트에서 마크다운 삽입:
   ![filename](/images/2024/01/image-1234567890-abc123.jpg)
   ↓
8. 에디터에 자동 삽입됨
```

## 보안 고려사항

### 현재 구현 (개발 환경 전용)

- ✅ 로컬 개발 환경에서만 접근 가능
- ✅ 파일 시스템 직접 접근 (Node.js fs 모듈)
- ✅ 인증/권한 없음 (개인 개발자용)

### 프로덕션 배포 시 고려사항

1. **에디터 접근 제한**
   ```typescript
   // app/admin/editor/page.tsx
   if (process.env.NODE_ENV === 'production') {
     return <div>에디터는 개발 환경에서만 사용 가능합니다.</div>
   }
   ```

2. **API 라우트 보호**
   ```typescript
   // app/admin/api/posts/route.ts
   if (process.env.NODE_ENV === 'production') {
     return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
   }
   ```

3. **환경 변수 기반 제어**
   ```bash
   # .env.local
   ENABLE_EDITOR=true  # 개발 환경에서만 true
   ```

## 확장 가능성

### 향후 개선 사항

1. **자동 저장**
   - Debounce를 사용한 자동 저장
   - 로컬 스토리지 백업

2. **이미지 최적화**
   - Sharp를 사용한 이미지 리사이징
   - WebP 변환

3. **태그/카테고리**
   - Frontmatter에 tags 추가
   - 카테고리별 필터링

4. **검색 기능**
   - 포스트 내용 검색
   - 제목/설명 검색

5. **드래그 앤 드롭**
   - 이미지 파일 드래그 앤 드롭
   - 포스트 순서 변경

## 기술 스택

- **Next.js 15**: App Router, API Routes
- **React 19**: 클라이언트 컴포넌트
- **CodeMirror**: 마크다운 에디터
- **ReactMarkdown**: 마크다운 렌더링
- **gray-matter**: Frontmatter 파싱
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링

## 성능 최적화

1. **동적 임포트**: CodeMirror를 클라이언트에서만 로드
2. **정적 생성**: `generateStaticParams()`로 빌드 시 경로 생성
3. **이미지 최적화**: Next.js Image 컴포넌트 사용 가능
4. **코드 스플리팅**: 에디터 페이지는 필요 시에만 로드

