import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'

export const metadata: Metadata = {
  title: '관리자 페이지',
}

export default async function AdminPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            관리자 페이지
          </h1>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/admin/login' })
            }}
          >
            <button
              type="submit"
              className="rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {session?.user?.email} 으로 로그인됨
        </p>

        {/* 추후 각 섹션 CRUD 관리 UI 추가 예정 */}
        <div className="mt-8 text-center text-gray-400 dark:text-gray-500 text-sm">
          콘텐츠 관리 UI 준비 중...
        </div>
      </div>
    </main>
  )
}
