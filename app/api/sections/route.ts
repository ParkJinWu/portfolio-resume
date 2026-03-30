import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { NextRequest } from 'next/server'

const DEFAULT_SECTIONS = [
  { id: 'default-about',      key: 'about',      title: '소개',      navTitle: 'About',      order: 0, visible: true },
  { id: 'default-experience', key: 'experience', title: '경력',      navTitle: 'Experience', order: 1, visible: true },
  { id: 'default-skills',     key: 'skills',     title: '기술',      navTitle: 'Skills',     order: 2, visible: true },
  { id: 'default-projects',   key: 'projects',   title: '프로젝트',  navTitle: 'Projects',   order: 3, visible: true },
  { id: 'default-education',  key: 'education',  title: '학력',      navTitle: 'Education',  order: 4, visible: true },
  { id: 'default-contact',    key: 'contact',    title: '연락처',    navTitle: 'Contact',    order: 5, visible: true },
]

// GET /api/sections
export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { order: 'asc' },
    })
    if (sections.length === 0) {
      return Response.json({ data: DEFAULT_SECTIONS }, { status: 200 })
    }
    return Response.json({ data: sections }, { status: 200 })
  } catch {
    return Response.json({ data: DEFAULT_SECTIONS }, { status: 200 })
  }
}

// PUT /api/sections — 일괄 업데이트 (order, visible)
export async function PUT(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await req.json()
    const { sections } = body as {
      sections: Array<{ id: string; order: number; visible: boolean; title: string; navTitle: string }>
    }

    if (!Array.isArray(sections)) {
      return Response.json({ error: 'sections 배열이 필요합니다' }, { status: 400 })
    }

    if (sections.some((s) => !s.title?.trim() || !s.navTitle?.trim())) {
      return Response.json({ error: 'title과 navTitle은 비워둘 수 없습니다' }, { status: 400 })
    }

    // default- ID는 마이그레이션 전 fallback 데이터 → DB 업데이트 불가
    const isDefault = sections.some((s) => s.id.startsWith('default-'))
    if (isDefault) {
      const merged = DEFAULT_SECTIONS.map((d) => {
        const match = sections.find((s) => s.id === d.id)
        return match ? { ...d, order: match.order, visible: match.visible, title: match.title, navTitle: match.navTitle } : d
      }).sort((a, b) => a.order - b.order)
      return Response.json({ data: merged }, { status: 200 })
    }

    await prisma.$transaction(
      sections.map((s) =>
        prisma.section.update({
          where: { id: s.id },
          data: { order: s.order, visible: s.visible, title: s.title, navTitle: s.navTitle },
        }),
      ),
    )

    const updated = await prisma.section.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ data: updated }, { status: 200 })
  } catch {
    return Response.json({ error: '섹션 업데이트 실패' }, { status: 500 })
  }
}
