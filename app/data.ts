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
    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
    description: 'How AI is changing the way we design',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-1',
  },
  {
    title: 'Why I left my job to start my own company',
    description:
      'A deep dive into my decision to leave my job and start my own company',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-2',
  },
  {
    title: 'What I learned from my first year of freelancing',
    description:
      'A look back at my first year of freelancing and what I learned',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-3',
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

export const EMAIL = 'choo121600@gmail.com'
