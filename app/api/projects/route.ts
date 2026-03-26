import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { NextRequest } from 'next/server'

// GET /api/projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ data: projects }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 조회 실패', status: 500 }, { status: 500 })
  }
}

// POST /api/projects
export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const body = await req.json()
    const { title, description, imageUrl, siteUrl, githubUrl, tags, startDate, endDate, achievements, order } = body

    if (!title || !description) {
      return Response.json(
        { error: 'title, description은 필수입니다', status: 400 },
        { status: 400 },
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        siteUrl,
        githubUrl,
        tags: tags ?? [],
        startDate,
        endDate,
        achievements: achievements ?? [],
        order: order ?? 0,
      },
    })
    return Response.json({ data: project }, { status: 201 })
  } catch {
    return Response.json({ error: '데이터 생성 실패', status: 500 }, { status: 500 })
  }
}

// PUT /api/projects?id=xxx
export async function PUT(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, imageUrl, siteUrl, githubUrl, tags, startDate, endDate, achievements, order } = body

    const project = await prisma.project.update({
      where: { id },
      data: { title, description, imageUrl, siteUrl, githubUrl, tags, startDate, endDate, achievements, order },
    })
    return Response.json({ data: project }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 수정 실패', status: 500 }, { status: 500 })
  }
}

// DELETE /api/projects?id=xxx
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    await prisma.project.delete({ where: { id } })
    return Response.json({ data: null }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 삭제 실패', status: 500 }, { status: 500 })
  }
}
