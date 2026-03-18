'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Megaphone,
  Phone,
  BookOpen,
  Target,
  Zap,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/calls', label: 'Live Calls', icon: Phone },
  { href: '/journey', label: 'Journey Log', icon: BookOpen },
  { href: '/goals', label: 'Goal Tracker', icon: Target },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-navy-light border-r border-navy-lighter flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-navy-lighter">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-brand flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">DialForge</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-brand text-white'
                  : 'text-gray-400 hover:text-white hover:bg-navy-lighter'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-navy-lighter">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-lighter cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-navy-lighter flex items-center justify-center text-xs font-display font-bold text-orange-brand">
            DF
          </div>
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </aside>
  )
}
