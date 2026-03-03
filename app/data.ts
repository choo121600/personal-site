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

type TalkPost = {
  title: string
  description: string
  link: string
  uid: string
  date: string
}

type CommunityItem = {
  organization: string
  role: string
  start: string
  end: string
  highlights: string[]
  id: string
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
    name: 'Kickboard Module with Jetson Nano',
    description: 'A module that detects helmet usage and entry into children protection zones to control the maximum output speed of the kickboard.',
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
    start: '2025',
    end: 'Present',
    link: 'https://github.com/apache/airflow',
    id: 'work1',
  },  
  {
    company: 'arxtrus',
    title: 'Founder & Software Engineer',
    start: '2024',
    end: 'Present',
    link: 'https://arxtrus.com',
    id: 'work2',
  },
  {
    company: 'Canonical',
    title: 'Member of the Ubuntu',
    start: '2024',
    end: 'Present',
    link: 'https://launchpad.net/~ubuntumembers',
    id: 'work3',
  }
]

export const TALK_POSTS: TalkPost[] = [
  {
    title: 'Airflow Contributions Using Breeze & Astronomer Agents',
    description: 'Live demonstration of the Airflow OSS contribution workflow and production-grade Agent automation patterns.',
    link: '',
    uid: 'talk-3',
    date: 'Feb 2026',
  },
  {
    title: 'Airflow + Snowflake: Building the Perfect Harmony',
    description: 'Presented end-to-end ML workflow architecture integrating Apache Airflow with Snowflake to 3,000+ attendees.',
    link: '',
    uid: 'talk-2',
    date: 'Aug 2025',
  },
  {
    title: 'Airflow 101 with Astro CLI',
    description: 'Hands-on workshop: Daily news summary and investment advice messaging service.',
    link: 'https://www.meetup.com/apache-airflow-users-korea/events/303680210',
    uid: 'talk-1',
    date: '',
  },
]

export const COMMUNITY: CommunityItem[] = [
  {
    organization: 'Apache Airflow Korea User Group',
    role: 'Founder & Leader',
    start: 'Dec 2023',
    end: 'Present',
    highlights: [
      'Founded and scaled a 400+ member open-source community, organizing 5 meetups and 3 workshops',
      'Built and operate a community Discourse forum with 100+ posts covering technical guides, Q&A, and OSS contribution onboarding',
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
