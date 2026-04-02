'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Project } from '@/lib/types'
import { ExternalLink, GitFork } from 'lucide-react'
import Image from 'next/image'

export default function Projects({ title = 'Projects' }: { title?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiFetch<Project[]>('/api/projects'),
  })

  if (isLoading) {
    return (
      <section
        id="projects"
        className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
          {title}
        </p>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-40 bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-full bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-muted/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!data || data.length === 0) return null

  return (
    <section
      id="projects"
      className="max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">
        {title}
      </p>
      <div className="space-y-10">
        {data.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-border bg-background p-6"
          >
            {/* 제목 + 기간 */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-foreground font-semibold text-lg">
                {project.title}
              </h3>
              {(project.startDate || project.endDate) && (
                <span className="text-sm text-muted whitespace-nowrap">
                  {project.startDate}{project.endDate ? ` ~ ${project.endDate}` : ''}
                </span>
              )}
            </div>

            {/* GitHub / Demo 링크 */}
            {(project.githubUrl || project.siteUrl) && (
              <div className="flex gap-2 mb-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <GitFork size={13} />
                    GitHub
                  </a>
                )}
                {project.siteUrl && (
                  <a
                    href={project.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    Demo
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {/* 이미지(왼쪽) + 설명(오른쪽) */}
            <div className={`flex ${project.imageUrl ? 'flex-col md:flex-row gap-5' : ''} mb-5`}>
              {project.imageUrl && (
                <div className="relative w-full md:w-40 shrink-0 aspect-video md:aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-muted/80 whitespace-pre-line leading-relaxed flex-1">
                {project.description}
              </p>
            </div>

            {/* 기술 스택 */}
            {project.tags.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  기술 스택
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-muted/10 border border-border text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 주요 성과 */}
            {project.achievements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  주요 성과
                </h4>
                <ol className="space-y-2">
                  {project.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-muted/80 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
