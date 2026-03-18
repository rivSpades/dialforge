import { createClient } from '@/lib/supabase/server'

interface DailyPnLChartProps {
  userId: string
}

export async function DailyPnLChart({ userId }: DailyPnLChartProps) {
  const supabase = await createClient()

  // Last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const startDate = days[0]

  const [callsResult, spendResult] = await Promise.all([
    supabase
      .from('calls')
      .select('payout, called_at')
      .eq('user_id', userId)
      .eq('status', 'billable')
      .gte('called_at', `${startDate}T00:00:00`),
    supabase
      .from('daily_spend')
      .select('amount, spend_date')
      .eq('user_id', userId)
      .gte('spend_date', startDate),
  ])

  const callsByDay: Record<string, number> = {}
  const spendByDay: Record<string, number> = {}

  days.forEach(d => { callsByDay[d] = 0; spendByDay[d] = 0 })

  ;(callsResult.data ?? []).forEach(c => {
    const day = c.called_at.split('T')[0]
    if (callsByDay[day] !== undefined) callsByDay[day] += c.payout
  })

  ;(spendResult.data ?? []).forEach(s => {
    if (spendByDay[s.spend_date] !== undefined) spendByDay[s.spend_date] += s.amount
  })

  const chartData = days.map(d => ({
    date: new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: callsByDay[d],
    spend: spendByDay[d],
    profit: callsByDay[d] - spendByDay[d],
  }))

  const hasData = chartData.some(d => d.revenue > 0 || d.spend > 0)

  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
      <h3 className="font-display font-semibold text-white mb-6">7-Day P&L</h3>
      {!hasData ? (
        <div className="h-48 flex flex-col items-center justify-center text-center">
          <p className="text-gray-400 text-sm mb-2">No data yet</p>
          <p className="text-xs text-gray-500">Calls will appear here once the webhook is live</p>
        </div>
      ) : (
        <div className="h-48 flex items-end gap-2">
          {chartData.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5" style={{ height: '160px' }}>
                {/* Revenue bar */}
                <div
                  className="flex-1 bg-green-brand/70 rounded-t"
                  style={{ height: `${Math.max(2, (d.revenue / 200) * 160)}px` }}
                />
                {/* Spend bar */}
                <div
                  className="flex-1 bg-orange-brand/70 rounded-t"
                  style={{ height: `${Math.max(2, (d.spend / 200) * 160)}px` }}
                />
              </div>
              <span className="text-xs text-gray-500">{d.date}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-navy-lighter">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-brand/70" />
          <span className="text-xs text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-orange-brand/70" />
          <span className="text-xs text-gray-400">Spend</span>
        </div>
      </div>
    </div>
  )
}
