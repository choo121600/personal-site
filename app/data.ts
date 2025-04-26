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
    title: 'The Easiest Way to Get Started with Apache Airflow: Astro CLI',
    description: 'How to quickly set up and run Apache Airflow projects using Astro CLI.',
    link: 'https://devocean.sk.com/search/techBoardDetail.do?ID=167304',
    uid: 'blog-1',
  },
  {
    title: 'What’s New in Apache Airflow 2.10.0',
    description: 'A detailed overview of the new features introduced in Apache Airflow 2.10.0.',
    link: 'https://discourse.airflow-kr.org/t/apache-airflow-2-10-0/290',
    uid: 'blog-2',
  },
]

export const TALK_POSTS: TalkPost[] = [
  {
    title: 'Airflow 101 with Astro CLI',
    description: 'Hands-on workshop: Build a daily news summary and investment advice messaging service.',
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
