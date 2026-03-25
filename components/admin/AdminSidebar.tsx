'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderOpen,
  Wrench,
  GraduationCap,
  Mail,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/about', label: '소개', icon: User },
  { href: '/admin/experience', label: '경력', icon: Briefcase },
  { href: '/admin/projects', label: '프로젝트', icon: FolderOpen },
  { href: '/admin/skills', label: '기술', icon: Wrench },
  { href: '/admin/education', label: '학력', icon: GraduationCap },
  { href: '/admin/contact', label: '연락처', icon: Mail },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex w-56 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">관리자</h2>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-foreground/10 font-medium text-foreground'
                      : 'text-muted hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
