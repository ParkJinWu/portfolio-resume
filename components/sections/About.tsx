'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About } from '@/lib/types'
import type { Contact } from '@/lib/types'
import { ImageSlider } from '@/components/ui/ImageSlider'
import { Mail, GitFork, Globe, BookOpen, Link, Phone } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  email: Mail,
  github: GitFork,
  linkedin: Link,
  blog: BookOpen,
  website: Globe,
  phone: Phone,
}

export default function About() {
  const { data: about, isLoading: aboutLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => apiFetch<About | null>('/api/about'),
  })

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => apiFetch<Contact[]>('/api/contact'),
  })

  const isLoading = aboutLoading || contactsLoading

  if (isLoading) {
    return (
      <section
        id="about"
        className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          About
        </p>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-64 h-64 rounded-full bg-muted/20 animate-pulse" />
            <div className="mt-6 w-full space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 w-full bg-muted/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-7 w-24 bg-muted/20 rounded animate-pulse" />
            <div className="h-5 w-40 bg-muted/20 rounded animate-pulse" />
            <div className="h-4 w-full bg-muted/20 rounded animate-pulse mt-4" />
            <div className="h-4 w-5/6 bg-muted/20 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-muted/20 rounded animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  if (!about) return null

  const effectiveImages =
    about.images && about.images.length > 0
      ? about.images
      : about.imageUrl
        ? [about.imageUrl]
        : []

  return (
    <section
      id="about"
      className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        About
      </p>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* 왼쪽: 프로필 이미지 + 연락처 */}
        <div className="flex flex-col items-center shrink-0 md:w-80">
          <ImageSlider images={effectiveImages} positions={about.imagePositions} alt={about.name} />

          {contacts && contacts.length > 0 && (
            <div className="mt-6 w-full space-y-2">
              {contacts.map((item) => {
                const Icon = iconMap[item.type.toLowerCase()] ?? Globe
                const isEmail = item.type.toLowerCase() === 'email'
                const isPhone = item.type.toLowerCase() === 'phone'
                const href = isEmail
                  ? `mailto:${item.value}`
                  : isPhone
                    ? `tel:${item.value}`
                    : item.value

                return (
                  <a
                    key={item.id}
                    href={href}
                    target={isEmail || isPhone ? undefined : '_blank'}
                    rel={isEmail || isPhone ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 hover:bg-muted/10 transition-colors"
                  >
                    <Icon size={16} className="text-muted shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted truncate">{item.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* 오른쪽: 이름, 직함, bio */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-foreground">{about.name}</h2>
          <p className="text-muted mt-1 mb-6">{about.title}</p>
          <p className="text-foreground whitespace-pre-line leading-relaxed text-sm">
            {about.bio}
          </p>
        </div>
      </div>
    </section>
  )
}
