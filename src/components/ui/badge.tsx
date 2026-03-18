import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'default'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variant === 'success' && 'bg-green-brand/20 text-green-brand',
      variant === 'error' && 'bg-orange-brand/20 text-orange-brand',
      variant === 'warning' && 'bg-yellow-500/20 text-yellow-400',
      variant === 'default' && 'bg-navy-lighter text-gray-400',
    )}>
      {children}
    </span>
  )
}
