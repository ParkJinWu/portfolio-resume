export interface About {
  id: string
  name: string
  title: string
  bio: string
  imageUrl: string | null
  images: string[]
  resumeUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string | null
  siteUrl: string | null
  githubUrl: string | null
  tags: string[]
  startDate: string | null
  endDate: string | null
  achievements: string[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  category: string
  iconUrl: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  startDate: string
  endDate: string | null
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  type: string
  label: string
  value: string
  order: number
  createdAt: string
  updatedAt: string
}
