'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Section } from '@/lib/types'
import ThemeToggle from "@/components/ThemeToggle";

const DEFAULT_NAV = [
  { key: 'about', navTitle: 'About' },
  { key: 'experience', navTitle: 'Experience' },
  { key: 'skills', navTitle: 'Skills' },
  { key: 'projects', navTitle: 'Projects' },
  { key: 'education', navTitle: 'Education' },
]

export default function Nav() {
  const [heroVisible, setHeroVisible] = useState(true)

  const { data: sections } = useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: () => apiFetch<Section[]>('/api/sections'),
  })

  const navItems = sections
    ? sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order)
        .map((s) => ({ key: s.key, navTitle: s.navTitle }))
    : DEFAULT_NAV

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-transform duration-300 ${
        heroVisible ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#hero" className="font-mono text-xs tracking-widest uppercase text-foreground">
          Portfolio
        </a>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                className="text-xs text-muted hover:text-foreground transition-colors font-mono uppercase tracking-wider"
              >
                {item.navTitle}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
