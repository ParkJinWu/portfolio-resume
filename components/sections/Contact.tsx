'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Contact } from '@/lib/types'
import { Mail, GitFork, Globe, BookOpen, Link } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  email: Mail,
  github: GitFork,
  linkedin: Link,
  blog: BookOpen,
  website: Globe,
}

export default function Contact() {
  const { data, isLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => apiFetch<Contact[]>('/api/contact'),
  })

  if (isLoading) {
    return (
      <section id="contact" className="max-w-2xl mx-auto px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          Contact
        </p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-48 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!data || data.length === 0) return null

  return (
    <section id="contact" className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        Contact
      </p>
      <div className="space-y-4">
        {data.map((item) => {
          const Icon = iconMap[item.type.toLowerCase()] ?? Globe
          const href = item.type.toLowerCase() === 'email'
            ? `mailto:${item.value}`
            : item.value

          return (
            <a
              key={item.id}
              href={href}
              target={item.type.toLowerCase() === 'email' ? undefined : '_blank'}
              rel={item.type.toLowerCase() === 'email' ? undefined : 'noopener noreferrer'}
              className="flex items-center gap-3 text-muted hover:text-foreground transition-colors group"
            >
              <Icon size={16} />
              <span className="text-sm">{item.label}</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
