'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About, Experience, Project, Skill, Education, Contact } from '@/lib/types'
import {
  User,
  Briefcase,
  FolderOpen,
  Wrench,
  GraduationCap,
  Mail,
} from 'lucide-react'

const SECTIONS = [
  { key: 'about', label: '소개', href: '/admin/about', icon: User },
  { key: 'experience', label: '경력', href: '/admin/experience', icon: Briefcase },
  { key: 'projects', label: '프로젝트', href: '/admin/projects', icon: FolderOpen },
  { key: 'skills', label: '기술', href: '/admin/skills', icon: Wrench },
  { key: 'education', label: '학력', href: '/admin/education', icon: GraduationCap },
  { key: 'contact', label: '연락처', href: '/admin/contact', icon: Mail },
] as const

export default function AdminDashboard() {
  const about = useQuery({ queryKey: ['about'], queryFn: () => apiFetch<About | null>('/api/about') })
  const experience = useQuery({ queryKey: ['experience'], queryFn: () => apiFetch<Experience[]>('/api/experience') })
  const projects = useQuery({ queryKey: ['projects'], queryFn: () => apiFetch<Project[]>('/api/projects') })
  const skills = useQuery({ queryKey: ['skills'], queryFn: () => apiFetch<Skill[]>('/api/skills') })
  const education = useQuery({ queryKey: ['education'], queryFn: () => apiFetch<Education[]>('/api/education') })
  const contact = useQuery({ queryKey: ['contact'], queryFn: () => apiFetch<Contact[]>('/api/contact') })

  const counts: Record<string, string> = {
    about: about.data ? '설정됨' : '미설정',
    experience: experience.data ? `${experience.data.length}개` : '-',
    projects: projects.data ? `${projects.data.length}개` : '-',
    skills: skills.data ? `${skills.data.length}개` : '-',
    education: education.data ? `${education.data.length}개` : '-',
    contact: contact.data ? `${contact.data.length}개` : '-',
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">대시보드</h1>

      <div className="grid grid-cols-3 gap-4">
        {SECTIONS.map(({ key, label, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition-colors hover:bg-surface"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
              <Icon size={20} className="text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted">{counts[key]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
