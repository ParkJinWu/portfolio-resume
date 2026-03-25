import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { NextRequest } from 'next/server'

// GET /api/education
export async function GET() {
  try {
    const educations = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ data: educations }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 조회 실패', status: 500 }, { status: 500 })
  }
}

// POST /api/education
export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const body = await req.json()
    const { institution, degree, startDate, endDate, description, order } = body

    if (!institution || !degree || !startDate) {
      return Response.json(
        { error: 'institution, degree, startDate는 필수입니다', status: 400 },
        { status: 400 },
      )
    }

    const education = await prisma.education.create({
      data: { institution, degree, startDate, endDate, description, order: order ?? 0 },
    })
    return Response.json({ data: education }, { status: 201 })
  } catch {
    return Response.json({ error: '데이터 생성 실패', status: 500 }, { status: 500 })
  }
}

// PUT /api/education?id=xxx
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
    const { institution, degree, startDate, endDate, description, order } = body

    const education = await prisma.education.update({
      where: { id },
      data: { institution, degree, startDate, endDate, description, order },
    })
    return Response.json({ data: education }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 수정 실패', status: 500 }, { status: 500 })
  }
}

// DELETE /api/education?id=xxx
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    await prisma.education.delete({ where: { id } })
    return Response.json({ data: null }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 삭제 실패', status: 500 }, { status: 500 })
  }
}
