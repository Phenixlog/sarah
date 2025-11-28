'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckSquare, FolderKanban, LayoutDashboard, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'To-Do',
    href: '/todos',
    icon: CheckSquare,
  },
  {
    name: 'Projets',
    href: '/projects',
    icon: FolderKanban,
  },
]

export function Nav({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-border bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-text-primary">
              Activity Tracker
            </Link>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white text-background'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
