'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Experience } from '@/lib/types'

export default function Experience({ title = 'Experience' }: { title?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => apiFetch<Experience[]>('/api/experience'),
  })

  if (isLoading) {
    return (
      <section
        id="experience"
        className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          {title}
        </p>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-48 bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-full bg-muted/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!data || data.length === 0) return null

  return (
    <section
      id="experience"
      className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        {title}
      </p>
      <div className="space-y-10">
        {data.map((exp) => (
          <div key={exp.id}>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h3 className="text-foreground font-medium">{exp.position}</h3>
              <span className="text-xs text-muted whitespace-nowrap">
                {exp.startDate} — {exp.endDate ?? '현재'}
              </span>
            </div>
            <p className="text-sm text-muted mb-2">{exp.company}</p>
            <p className="text-sm text-muted/80 whitespace-pre-line leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
