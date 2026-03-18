import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface DayEntry {
  date: string
  revenue: number
  spend: number
  profit: number
  callCount: number
}

interface JourneyTimelineProps {
  days: DayEntry[]
}

export function JourneyTimeline({ days }: JourneyTimelineProps) {
  const hasAnyData = days.some(d => d.revenue > 0 || d.spend > 0)

  if (!hasAnyData) {
    return (
      <div className="bg-navy-light border border-navy-lighter rounded-xl p-12 text-center">
        <h3 className="font-display font-semibold text-white mb-2">Your journey starts here</h3>
        <p className="text-gray-400 text-sm">
          Daily entries will appear once you have call data and spend logged.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {days.map((day, idx) => {
        const isToday = day.date === new Date().toISOString().split('T')[0]
        const status: 'positive' | 'negative' | 'neutral' =
          day.profit > 0 ? 'positive' : day.profit < 0 ? 'negative' : 'neutral'

        const borderColor =
          status === 'positive' ? 'border-green-brand/50' :
          status === 'negative' ? 'border-orange-brand/50' :
          'border-navy-lighter'

        const Icon = status === 'positive' ? TrendingUp : status === 'negative' ? TrendingDown : Minus
        const iconColor = status === 'positive' ? 'text-green-brand' : status === 'negative' ? 'text-orange-brand' : 'text-gray-400'

        return (
          <div key={day.date} className={`bg-navy-light border ${borderColor} rounded-xl p-5 ${isToday ? 'ring-1 ring-orange-brand/30' : ''}`}>
            <div className="flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative flex-shrink-0 mt-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  status === 'positive' ? 'bg-green-brand/20' :
                  status === 'negative' ? 'bg-orange-brand/20' :
                  'bg-navy-lighter'
                }`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                {idx < days.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-3 bg-navy-lighter" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-display font-semibold text-white text-sm">
                      {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                        weekday: 'long', month: 'short', day: 'numeric'
                      })}
                    </span>
                    {isToday && (
                      <span className="ml-2 text-xs bg-orange-brand/20 text-orange-brand px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </div>
                  <span className={`font-display font-bold text-lg ${
                    status === 'positive' ? 'text-green-brand' :
                    status === 'negative' ? 'text-orange-brand' :
                    'text-gray-400'
                  }`}>
                    {day.profit > 0 ? '+' : ''}{formatCurrency(day.profit)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Revenue</p>
                    <p className="text-sm font-medium text-white">{formatCurrency(day.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Spend</p>
                    <p className="text-sm font-medium text-white">{formatCurrency(day.spend)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Calls</p>
                    <p className="text-sm font-medium text-white">{day.callCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
