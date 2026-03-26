'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Skill } from '@/lib/types'

export default function Skills() {
  const { data, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => apiFetch<Skill[]>('/api/skills'),
  })

  if (isLoading) {
    return (
      <section
        id="skills"
        className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-7 w-20 bg-muted/20 rounded-full animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!data || data.length === 0) return null

  const grouped = data.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || '기타'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <section
      id="skills"
      className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        Skills
      </p>
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-foreground mb-3">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full border border-border text-muted"
                >
                  {skill.iconUrl && (
                    <img
                      src={skill.iconUrl}
                      alt={skill.name}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
