'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About } from '@/lib/types'

export default function About() {
  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => apiFetch<About | null>('/api/about'),
  })

  if (isLoading) {
    return (
      <section
        id="about"
        className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          About
        </p>
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted/20 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted/20 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-muted/20 rounded animate-pulse" />
        </div>
      </section>
    )
  }

  if (!data) return null

  return (
    <section
      id="about"
      className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        About
      </p>
      <p className="text-foreground whitespace-pre-line leading-relaxed">
        {data.bio}
      </p>
    </section>
  )
}
