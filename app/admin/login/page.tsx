import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: '관리자 로그인',
  description: '포트폴리오 관리자 페이지 로그인',
}

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect('/admin')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            관리자 로그인
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
