type Project = {
  name: string
  nameKo: string
  description: string
  descriptionKo: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  titleKo: string
  start: string
  end: string
  link: string
  id: string
}

type CommunityItem = {
  organization: string
  organizationKo: string
  role: string
  roleKo: string
  start: string
  startKo: string
  end: string
  highlights: string[]
  highlightsKo: string[]
  id: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'arxtrus-milkyway',
    nameKo: 'arxtrus-milkyway',
    description:
      'Data pipline for the financial industry that collects, cleans, and analyzes data from various sources.',
    descriptionKo:
      '다양한 출처의 데이터를 수집·정제·분석하는 금융 산업용 데이터 파이프라인.',
    link: 'https://arxtrus.com',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Kickboard Module with Jetson Nano',
    nameKo: 'Jetson Nano 기반 킥보드 모듈',
    description:
      'A module that detects helmet usage and entry into children protection zones to control the maximum output speed of the kickboard.',
    descriptionKo:
      '헬멧 착용 여부와 어린이 보호구역 진입을 감지하여 킥보드의 최고 속도를 제어하는 모듈.',
    link: 'https://github.com/choo121600/kickboardModule',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Apache Software Foundation',
    title: 'Committer for Apache Airflow',
    titleKo: 'Apache Airflow 커미터',
    start: '2025',
    end: 'Present',
    link: 'https://github.com/apache/airflow',
    id: 'work1',
  },
  {
    company: 'arxtrus',
    title: 'Founder & Software Engineer',
    titleKo: '창업자 · 소프트웨어 엔지니어',
    start: '2024',
    end: 'Present',
    link: 'https://arxtrus.com',
    id: 'work2',
  },
  {
    company: 'Canonical',
    title: 'Member of the Ubuntu',
    titleKo: 'Ubuntu 멤버',
    start: '2024',
    end: 'Present',
    link: 'https://launchpad.net/~ubuntumembers',
    id: 'work3',
  },
]

export const COMMUNITY: CommunityItem[] = [
  {
    organization: 'Apache Airflow Korea User Group',
    organizationKo: 'Apache Airflow 한국 사용자 모임',
    role: 'Founder & Leader',
    roleKo: '설립자 · 대표',
    start: 'Dec 2023',
    startKo: '2023년 12월',
    end: 'Present',
    highlights: [
      'Founded and scaled a 400+ member open-source community, organizing 5 meetups and 3 workshops',
      'Built and operate a community Discourse forum with 100+ posts covering technical guides, Q&A, and OSS contribution onboarding',
    ],
    highlightsKo: [
      '400명 이상의 오픈소스 커뮤니티를 설립·성장시키고 밋업 5회와 워크숍 3회를 개최',
      '기술 가이드, 질의응답, 오픈소스 기여 입문 등 100개 이상의 게시글이 있는 Discourse 커뮤니티 포럼을 구축·운영',
    ],
    id: 'community-1',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/choo121600',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/yeonguk-choo',
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/yeong_uk._',
  },
]

export const EMAIL = 'choo121600@apache.org'
