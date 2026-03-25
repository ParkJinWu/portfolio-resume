import { auth } from '@/auth'

export async function requireAuth(): Promise<Response | null> {
  const session = await auth()
  if (!session) {
    return Response.json({ error: '인증이 필요합니다' }, { status: 401 })
  }
  return null
}
