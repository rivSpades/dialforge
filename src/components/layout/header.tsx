import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-navy-lighter flex items-center justify-between px-6">
      <div>
        <h1 className="font-display font-semibold text-xl text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-lighter transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-brand rounded-full" />
        </button>
      </div>
    </header>
  )
}
