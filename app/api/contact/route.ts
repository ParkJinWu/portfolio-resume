import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// GET /api/contact
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json({ data: contacts }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 조회 실패', status: 500 }, { status: 500 })
  }
}

// POST /api/contact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, label, value, order } = body

    if (!type || !label || !value) {
      return Response.json(
        { error: 'type, label, value는 필수입니다', status: 400 },
        { status: 400 },
      )
    }

    const contact = await prisma.contact.create({
      data: { type, label, value, order: order ?? 0 },
    })
    return Response.json({ data: contact }, { status: 201 })
  } catch {
    return Response.json({ error: '데이터 생성 실패', status: 500 }, { status: 500 })
  }
}

// PUT /api/contact?id=xxx
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    const body = await req.json()
    const { type, label, value, order } = body

    const contact = await prisma.contact.update({
      where: { id },
      data: { type, label, value, order },
    })
    return Response.json({ data: contact }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 수정 실패', status: 500 }, { status: 500 })
  }
}

// DELETE /api/contact?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'id가 필요합니다', status: 400 }, { status: 400 })
    }

    await prisma.contact.delete({ where: { id } })
    return Response.json({ data: null }, { status: 200 })
  } catch {
    return Response.json({ error: '데이터 삭제 실패', status: 500 }, { status: 500 })
  }
}
