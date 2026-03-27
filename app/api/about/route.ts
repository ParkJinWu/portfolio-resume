import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { NextRequest } from 'next/server'

// GET /api/about
export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    return Response.json({ data: about }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 조회 실패', status: 500 }, { status: 500 })
  }
}

// POST /api/about
export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const body = await req.json()
    const { name, title, bio, imageUrl, images, imagePositions, resumeUrl, roles, rolesPosition, rolesInterval } = body

    if (!name || !title || !bio) {
      return Response.json({ error: 'name, title, bio는 필수입니다', status: 400 }, { status: 400 })
    }

    const about = await prisma.about.create({
      data: { name, title, bio, imageUrl, images: images ?? [], imagePositions: imagePositions ?? {}, resumeUrl, roles: roles ?? [], rolesPosition: rolesPosition ?? 'before', rolesInterval: rolesInterval ?? 3 },
    })
    return Response.json({ data: about }, { status: 201 })
  } catch {
    return Response.json({ error: '데이터 생성 실패', status: 500 }, { status: 500 })
  }
}

// PUT /api/about?id=xxx
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
    const { name, title, bio, imageUrl, images, imagePositions, resumeUrl, roles, rolesPosition, rolesInterval } = body

    const about = await prisma.about.update({
      where: { id },
      data: { name, title, bio, imageUrl, images: images ?? [], imagePositions: imagePositions ?? {}, resumeUrl, roles: roles ?? [], rolesPosition: rolesPosition ?? 'before', rolesInterval: rolesInterval ?? 3 },
    })
    return Response.json({ data: about }, { status: 200 })
  } catch (error) {
    console.error('About PUT error:', error)
    return Response.json({ error: '데이터 수정 실패', status: 500 }, { status: 500 })
  }
}

// DELETE /api/about?id=xxx
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    await prisma.about.delete({ where: { id } })
    return Response.json({ data: null }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 삭제 실패', status: 500 }, { status: 500 })
  }
}
