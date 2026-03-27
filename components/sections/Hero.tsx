'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About } from '@/lib/types'
import { TextRotate } from '@/components/ui/TextRotate'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => apiFetch<About | null>('/api/about'),
  })

  const rotatingTexts = data?.roles?.length
    ? data.roles
    : data?.title
      ? [data.title]
      : []

  const isBefore = data?.rolesPosition !== 'after'

  const rotateBlock = rotatingTexts.length > 0 && (
    <span className="inline-flex items-center bg-[#e8735a] rounded-xl px-5 py-2 sm:px-6 sm:py-3">
      <TextRotate
        texts={rotatingTexts}
        rotationInterval={3000}
        splitBy="characters"
        staggerDuration={0.03}
        staggerFrom="first"
        mainClassName="text-3xl sm:text-4xl md:text-6xl font-light text-white justify-center"
      />
    </span>
  )

  const fixedBlock = (
    <span className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-foreground">
      {isBefore ? `개발자 ${data?.name ?? ''}입니다.` : (data?.name ?? 'Hello')}
    </span>
  )

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-6 border-b border-dashed border-border"
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <div className="h-14 w-48 bg-muted/20 rounded animate-pulse" />
          <div className="h-14 w-36 bg-muted/20 rounded-xl animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <h1 className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {isBefore ? (
              <>
                {rotateBlock}
                {fixedBlock}
              </>
            ) : (
              <>
                {fixedBlock}
                {rotateBlock}
              </>
            )}
          </h1>

          <div className="flex gap-3">
            <a
              href="#projects"
              className="px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full transition-opacity hover:opacity-90"
            >
              Projects
            </a>
            <a
              href="#about"
              className="px-5 py-2.5 border border-border text-sm font-medium rounded-full text-foreground transition-colors hover:bg-muted/10"
            >
              About Me
            </a>
          </div>
        </div>
      )}

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  )
}
