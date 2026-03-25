import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { NextRequest } from 'next/server'

// GET /api/experience
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ data: experiences }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 조회 실패', status: 500 }, { status: 500 })
  }
}

// POST /api/experience
export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const body = await req.json()
    const { company, position, startDate, endDate, description, order } = body

    if (!company || !position || !startDate || !description) {
      return Response.json(
        { error: 'company, position, startDate, description은 필수입니다', status: 400 },
        { status: 400 },
      )
    }

    const experience = await prisma.experience.create({
      data: { company, position, startDate, endDate, description, order: order ?? 0 },
    })
    return Response.json({ data: experience }, { status: 201 })
  } catch {
    return Response.json({ error: '데이터 생성 실패', status: 500 }, { status: 500 })
  }
}

// PUT /api/experience?id=xxx
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
    const { company, position, startDate, endDate, description, order } = body

    const experience = await prisma.experience.update({
      where: { id },
      data: { company, position, startDate, endDate, description, order },
    })
    return Response.json({ data: experience }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 수정 실패', status: 500 }, { status: 500 })
  }
}

// DELETE /api/experience?id=xxx
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    await prisma.experience.delete({ where: { id } })
    return Response.json({ data: null }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 삭제 실패', status: 500 }, { status: 500 })
  }
}
