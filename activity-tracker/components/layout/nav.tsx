'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Loader2,
  Menu,
  X,
  User,
  Settings,
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Mes Tâches',
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
  const [isPending, startTransition] = useTransition()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <nav className="sticky top-0 z-50 glass-strong backdrop-blur-glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-sm shadow-primary-glow transition-all group-hover:shadow-glow-md group-hover:scale-110">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">Activity Tracker</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent',
                      isActive
                        ? 'text-white bg-white/5 border-white/10 shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isActive ? "text-primary-light" : "text-text-tertiary group-hover:text-text-primary"
                    )} />
                    {item.name}
                    {isActive && (
                      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/10 to-accent-cyan/10 opacity-50" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isPending && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-text-secondary animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Chargement...</span>
              </div>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-elevated/50 border border-border hover:border-primary/50 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-glow-sm shadow-primary-glow group-hover:scale-105 transition-transform">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-text-secondary">Connecté en tant que</span>
                    <span className="text-sm font-medium text-text-primary max-w-[100px] truncate">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-border/50">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-danger hover:bg-danger/10 hover:text-danger focus:bg-danger/10 focus:text-danger"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-surface-elevated/95 backdrop-blur-xl border-b border-border/50 p-4 space-y-4 animate-slide-in-down shadow-xl">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  {item.name}
                </button>
              )
            })}
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 px-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">{user?.email}</span>
                <span className="text-xs text-text-secondary">Utilisateur</span>
              </div>
            </div>
            <Button
              variant="danger"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
