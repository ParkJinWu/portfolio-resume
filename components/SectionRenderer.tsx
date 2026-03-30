'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Section } from '@/lib/types'
import { ComponentType } from 'react'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Education from '@/components/sections/Education'

const SECTION_COMPONENTS: Record<string, ComponentType<{ title?: string }>> = {
  about: About,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  education: Education,
}

const DEFAULT_ORDER = ['about', 'experience', 'skills', 'projects', 'education']

export function SectionRenderer() {
  const { data: sections } = useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: () => apiFetch<Section[]>('/api/sections'),
  })

  const visibleSections = sections
    ? sections.filter((s) => s.visible).sort((a, b) => a.order - b.order)
    : DEFAULT_ORDER.map((key, i) => ({ key, order: i, visible: true }) as Section)

  return (
    <>
      {visibleSections.map((section) => {
        const Component = SECTION_COMPONENTS[section.key]
        if (!Component) return null
        return <Component key={section.key} title={section.title} />
      })}
    </>
  )
}
