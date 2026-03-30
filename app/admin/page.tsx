'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About, Experience, Project, Skill, Education, Contact, Section } from '@/lib/types'
import { SortableList } from '@/components/admin/SortableList'
import {
  User,
  Briefcase,
  FolderOpen,
  Wrench,
  GraduationCap,
  Mail,
  Eye,
  EyeOff,
  ExternalLink,
  Undo2,
  Save,
  type LucideIcon,
} from 'lucide-react'

const SECTION_META: Record<string, { icon: LucideIcon; href: string }> = {
  about:      { icon: User,          href: '/admin/about' },
  experience: { icon: Briefcase,     href: '/admin/experience' },
  projects:   { icon: FolderOpen,    href: '/admin/projects' },
  skills:     { icon: Wrench,        href: '/admin/skills' },
  education:  { icon: GraduationCap, href: '/admin/education' },
  contact:    { icon: Mail,          href: '/admin/contact' },
}

export default function AdminDashboard() {
  const qc = useQueryClient()

  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: () => apiFetch<Section[]>('/api/sections'),
  })

  const [localSections, setLocalSections] = useState<Section[]>([])

  useEffect(() => {
    if (sections.length > 0) {
      setLocalSections(sections)
    }
  }, [sections])

  const isDirty = JSON.stringify(
    localSections.map((s) => ({ id: s.id, order: s.order, visible: s.visible, title: s.title, navTitle: s.navTitle }))
  ) !== JSON.stringify(
    sections.map((s) => ({ id: s.id, order: s.order, visible: s.visible, title: s.title, navTitle: s.navTitle }))
  )

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

  const updateMutation = useMutation({
    mutationFn: (items: Array<{ id: string; order: number; visible: boolean; title: string; navTitle: string }>) =>
      apiFetch<Section[]>('/api/sections', {
        method: 'PUT',
        body: JSON.stringify({ sections: items }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sections'] }),
  })

  const handleReorder = (reordered: Section[]) => {
    setLocalSections(reordered.map((s, i) => ({ ...s, order: i })))
  }

  const handleFieldChange = (id: string, field: 'title' | 'navTitle', value: string) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const handleToggleVisible = (section: Section) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === section.id ? { ...s, visible: !s.visible } : s))
    )
  }

  const handleSave = () => {
    const payload = localSections.map((s, i) => ({
      id: s.id,
      order: i,
      visible: s.visible,
      title: s.title,
      navTitle: s.navTitle,
    }))
    updateMutation.mutate(payload)
  }

  const handleReset = () => {
    setLocalSections(sections)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">대시보드</h1>

      <div className="space-y-2">
        <SortableList
          items={localSections}
          onReorder={handleReorder}
          renderItem={(section) => {
            const meta = SECTION_META[section.key]
            const Icon = meta?.icon
            return (
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5">
                    <Icon size={16} className="text-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-xs text-muted mb-1 ${!section.visible && 'line-through'}`}>{section.key}</p>
                  <div className="flex items-center gap-3">
                    <div>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleFieldChange(section.id, 'title', e.target.value)}
                        className="w-24 bg-transparent text-sm font-medium text-foreground outline-none border-b border-transparent focus:border-foreground/30"
                        placeholder="제목"
                      />
                      <p className="text-[10px] text-muted/40 mt-0.5">섹션 제목</p>
                    </div>
                    <span className="text-muted/30">/</span>
                    <div>
                      <input
                        type="text"
                        value={section.navTitle}
                        onChange={(e) => handleFieldChange(section.id, 'navTitle', e.target.value)}
                        className="w-24 bg-transparent text-sm text-muted outline-none border-b border-transparent focus:border-foreground/30"
                        placeholder="Nav"
                      />
                      <p className="text-[10px] text-muted/40 mt-0.5">Nav 표시명</p>
                    </div>
                    <span className="text-xs text-muted ml-auto">{counts[section.key] ?? '-'}</span>
                  </div>
                </div>
              </div>
            )
          }}
          renderActions={(section) => {
            const meta = SECTION_META[section.key]
            return (
              <>
                <button
                  onClick={() => handleToggleVisible(section)}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
                  title={section.visible ? '숨기기' : '표시하기'}
                >
                  {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {meta && (
                  <Link
                    href={meta.href}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
                    title="관리"
                  >
                    <ExternalLink size={16} />
                  </Link>
                )}
              </>
            )
          }}
        />
      </div>

      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-6 py-3">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <p className="text-sm text-muted">변경사항이 있습니다</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <Undo2 size={14} />
                되돌리기
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Save size={14} />
                {updateMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
