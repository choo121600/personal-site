# Yeonguk Choo Personal Website

Next.js 15 기반의 개인 블로그 웹사이트입니다.

## 프로젝트 세팅

### 필수 요구사항

- Node.js 20.x 이상
- npm 또는 yarn

### 설치 방법

1. **저장소 클론**

```bash
git clone <repository-url>
cd personal-site
```

2. **의존성 설치**

```bash
npm install
```

3. **개발 서버 실행**

```bash
npm run dev
```

개발 서버가 실행되면 `http://localhost:3000`에서 사이트를 확인할 수 있습니다.

4. **개인 정보 업데이트**

`app/data.ts` 파일에서 개인 정보를 업데이트하세요:

```typescript
export const EMAIL = 'your@email.com'

export const SOCIAL_LINKS = [
  {
    label: 'Github',
    link: 'https://github.com/your-username',
  },
  // 소셜 링크 추가
]
```

## 블로그 글 작성 방법

### 방법 1: 웹 에디터 사용 (권장)

1. **에디터 접속**

개발 서버를 실행한 후 다음 URL로 접속:

```
http://localhost:3000/admin/editor
```

2. **새 포스트 작성**

- "새 포스트" 버튼 클릭
- 슬러그(URL 경로) 입력 (예: `my-first-post`)
- 제목, 설명, 날짜 입력
- 마크다운으로 내용 작성
- "저장" 버튼 클릭

3. **이미지 삽입**

**방법 A: 클립보드에서 붙여넣기**
- 이미지를 복사한 후 에디터 영역에 붙여넣기 (Ctrl+V / Cmd+V)
- 이미지가 자동으로 `public/images/YYYY/MM/` 경로에 저장되고 마크다운이 삽입됩니다

**방법 B: 파일 선택**
- "이미지 파일 선택" 버튼 클릭하여 이미지 파일 선택

4. **포스트 미리보기**

- "미리보기" 버튼을 클릭하여 작성 중인 포스트를 실시간으로 확인
- 다시 "에디터" 버튼을 클릭하여 편집 모드로 돌아가기

5. **포스트 관리**

- 왼쪽 사이드바에서 기존 포스트 목록 확인
- 포스트 클릭하여 편집
- 포스트에 마우스를 올리면 삭제 버튼 표시

### 방법 2: 직접 파일 생성

1. **파일 생성**

`content/posts/` 디렉토리에 `.md` 파일을 생성합니다:

```bash
content/posts/my-first-post.md
```

2. **Frontmatter 작성**

파일 상단에 frontmatter를 작성합니다:

```markdown
---
title: 포스트 제목
description: 포스트 설명
date: 2024-01-01
thumbnail: /images/2024/01/thumbnail.jpg
---

포스트 내용...
```

3. **마크다운 작성**

일반 마크다운 문법으로 내용을 작성합니다:

```markdown
## 제목

본문 내용입니다.

### 소제목

- 리스트 항목 1
- 리스트 항목 2

**굵은 글씨**와 *기울임*도 사용할 수 있습니다.

```코드 블록```도 지원됩니다.
```

### Frontmatter 필드 설명

- `title` (필수): 포스트 제목
- `description` (선택): 포스트 설명/요약
- `date` (선택): 포스트 작성일 (YYYY-MM-DD 형식)
- `thumbnail` (선택): 썸네일 이미지 경로 (예: `/images/2024/01/thumbnail.jpg`)

### 파일 저장 위치

- **마크다운 파일**: `content/posts/[슬러그].md`
- **이미지 파일**: `public/images/YYYY/MM/[파일명]`

### 포스트 확인

저장된 포스트는 다음 URL로 접근 가능:

```
http://localhost:3000/blog/[슬러그]
```

예: `http://localhost:3000/blog/my-first-post`

## 프로젝트 구조

```
personal-site/
├── app/                    # Next.js App Router
│   ├── admin/             # 관리자 페이지
│   │   └── editor/       # 블로그 에디터
│   ├── blog/              # 블로그 페이지
│   │   └── [slug]/        # 개별 포스트 페이지
│   ├── data.ts            # 개인 정보 데이터
│   └── layout.tsx         # 루트 레이아웃
├── content/               # 콘텐츠 파일
│   └── posts/             # 블로그 포스트 마크다운 파일
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수
│   └── posts.ts           # 포스트 관련 함수
└── public/                # 정적 파일
    └── images/            # 이미지 파일
        └── YYYY/MM/       # 연도/월별 이미지
```

## 주요 기능

- ✅ 마크다운 기반 블로그 포스트
- ✅ 웹 기반 에디터 (로컬 개발 환경)
- ✅ 이미지 복사-붙여넣기 자동 처리
- ✅ 실시간 미리보기
- ✅ 다크 모드 지원
- ✅ 반응형 디자인
- ✅ SEO 최적화

## 주의사항

1. **개발 환경 전용**: 웹 에디터는 로컬 개발 환경(`npm run dev`)에서만 사용하세요.
2. **파일 저장**: 포스트는 `content/posts/` 디렉토리에 저장되며, Git에 커밋해야 프로덕션에 반영됩니다.
3. **이미지 경로**: 이미지는 `public/images/`에 저장되므로 Git에 커밋해야 합니다.

## 문제 해결

### 이미지가 표시되지 않는 경우
- `public/images/` 디렉토리 권한 확인
- 이미지 파일이 올바른 경로에 저장되었는지 확인
- 이미지 경로가 `/images/YYYY/MM/filename.jpg` 형식인지 확인

### 포스트가 저장되지 않는 경우
- `content/posts/` 디렉토리 권한 확인
- 슬러그가 올바르게 입력되었는지 확인
- 파일 확장자가 `.md`인지 확인

### 에디터가 로드되지 않는 경우
- 필요한 라이브러리가 모두 설치되었는지 확인 (`npm install`)
- 개발 서버를 재시작해보세요
- 브라우저 콘솔에서 에러 메시지 확인

## 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.
