'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About } from '@/lib/types'

export default function Hero() {
  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => apiFetch<About | null>('/api/about'),
  })

  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center max-w-2xl mx-auto px-6 py-24 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
        Available for work
      </p>

      {isLoading ? (
        <>
          <div className="h-10 w-64 bg-muted/20 rounded animate-pulse mb-3" />
          <div className="h-6 w-96 bg-muted/20 rounded animate-pulse mb-8" />
        </>
      ) : (
        <>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
            {data?.name ?? 'Name Placeholder'}
          </h1>
          <p className="text-lg text-muted mb-8">
            {data?.title ?? 'Title Placeholder'}
          </p>
        </>
      )}

      <div className="flex gap-3">
        <a
          href="#contact"
          className="px-4 py-2 bg-foreground text-background text-sm rounded-full"
        >
          Contact
        </a>
        <a
          href="#projects"
          className="px-4 py-2 border border-border text-sm rounded-full text-foreground"
        >
          Projects
        </a>
      </div>
    </section>
  )
}
