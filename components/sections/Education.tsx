'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Education } from '@/lib/types'

export default function Education({ title = 'Education' }: { title?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: () => apiFetch<Education[]>('/api/education'),
  })

  if (isLoading) {
    return (
      <section
        id="education"
        className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          {title}
        </p>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-48 bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!data || data.length === 0) return null

  return (
    <section
      id="education"
      className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        {title}
      </p>
      <div className="space-y-8">
        {data.map((edu) => (
          <div key={edu.id}>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h3 className="text-foreground font-medium">{edu.institution}</h3>
              <span className="text-xs text-muted whitespace-nowrap">
                {edu.startDate} — {edu.endDate ?? '현재'}
              </span>
            </div>
            <p className="text-sm text-muted">{edu.degree}</p>
            {edu.description && (
              <p className="text-sm text-muted/80 mt-2 whitespace-pre-line leading-relaxed">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
