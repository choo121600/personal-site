type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type TalkPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'arxtrus-milkyway',
    description:
      'Data pipline for the financial industry that collects, cleans, and analyzes data from various sources.',
    link: 'https://arxtrus.com',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Smart Kickboard Module with Jetson Nano',
    description: 'A module that detects helmet usage and entry into children protection zones to control the maximum output speed of the kickboard.',
    link: 'https://github.com/choo121600/kickboardModule',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'arxtrus',
    title: 'Founder',
    start: '2024',
    end: 'Present',
    link: 'https://arxtrus.com',
    id: 'work1',
  },
  {
    company: 'Canonical',
    title: 'Member of the Ubuntu',
    start: '2024',
    end: 'Present',
    link: 'https://launchpad.net/~ubuntumembers',
    id: 'work2',
  }
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Apache Airflow를 시작하는 가장 쉬운 방법, Astro CLI',
    description: 'Apache Airflow는 설치와 실행 과정이 어려운 것으로 알려져 있지만, Astronomer가 개발한 Astro CLI를 통해 이를 쉽게 할 수 있게 되었습니다. Astro CLI는 단 세 개의 명령어로 프로젝트 설정 및 실행이 가능하며, 여러 운영체제(MacOS, Windows, Linux)에서도 사용이 가능하다는 장점이 있습니다. 이 도구는 직관적인 명령어 및 다양한 템플릿을 제공하여 Airflow의 학습 및 사용을 더욱 간단하고 효율적으로 만들어 줍니다.',
    link: 'https://devocean.sk.com/search/techBoardDetail.do?ID=167304',
    uid: 'blog-1',
  },
  {
    title: 'Apache Airflow 2.10.0의 특징들',
    description: ' Airflow 2.10.0 버전의 특징에 대해 정리한 글입니다.',
    link: 'https://discourse.airflow-kr.org/t/apache-airflow-2-10-0/290',
    uid: 'blog-2',
  },
]

export const TALK_POSTS: TalkPost[] = [
  {
    title: 'Airflow 101 with Astro CLI',
    description: 'Hands-on: 데일리 뉴스 요약 및 투자 조언 메시징 서비스 구축하기',
    link: 'https://www.meetup.com/apache-airflow-users-korea/events/303680210',
    uid: 'talk-1',
  }
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

export const EMAIL = 'choo121600@gmail.com'
