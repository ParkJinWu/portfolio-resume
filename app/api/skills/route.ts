import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { NextRequest } from 'next/server'

// GET /api/skills
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ data: skills }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 조회 실패', status: 500 }, { status: 500 })
  }
}

// POST /api/skills
export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const body = await req.json()
    const { name, category, iconUrl, order } = body

    if (!name || !category) {
      return Response.json(
        { error: 'name, category는 필수입니다', status: 400 },
        { status: 400 },
      )
    }

    const skill = await prisma.skill.create({
      data: { name, category, iconUrl, order: order ?? 0 },
    })
    return Response.json({ data: skill }, { status: 201 })
  } catch {
    return Response.json({ error: '데이터 생성 실패', status: 500 }, { status: 500 })
  }
}

// PUT /api/skills?id=xxx
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
    const { name, category, iconUrl, order } = body

    const skill = await prisma.skill.update({
      where: { id },
      data: { name, category, iconUrl, order },
    })
    return Response.json({ data: skill }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 수정 실패', status: 500 }, { status: 500 })
  }
}

// DELETE /api/skills?id=xxx
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    await prisma.skill.delete({ where: { id } })
    return Response.json({ data: null }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 삭제 실패', status: 500 }, { status: 500 })
  }
}
