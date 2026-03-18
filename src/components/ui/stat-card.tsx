import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  loading?: boolean
}

export function StatCard({ label, value, change, changeType = 'neutral', loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
        <div className="skeleton h-4 w-24 rounded mb-3" />
        <div className="skeleton h-8 w-32 rounded mb-2" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      {change && (
        <p className={cn(
          'text-xs mt-1 font-medium',
          changeType === 'positive' && 'text-green-brand',
          changeType === 'negative' && 'text-orange-brand',
          changeType === 'neutral' && 'text-gray-400',
        )}>
          {change}
        </p>
      )}
    </div>
  )
}
