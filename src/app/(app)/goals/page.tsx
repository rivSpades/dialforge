import { Header } from '@/components/layout/header'
import { GoalProgress } from '@/components/dashboard/goal-progress'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

async function getGoalData(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Last 30 days for streak/best day stats
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  const startDate = thirtyDaysAgo.toISOString().split('T')[0]

  const [callsToday, spendToday, callsHistory, spendHistory] = await Promise.all([
    supabase.from('calls').select('payout').eq('user_id', userId).eq('status', 'billable').gte('called_at', `${today}T00:00:00`),
    supabase.from('daily_spend').select('amount').eq('user_id', userId).eq('spend_date', today),
    supabase.from('calls').select('payout, called_at').eq('user_id', userId).eq('status', 'billable').gte('called_at', `${startDate}T00:00:00`),
    supabase.from('daily_spend').select('amount, spend_date').eq('user_id', userId).gte('spend_date', startDate),
  ])

  const todayRevenue = (callsToday.data ?? []).reduce((s, c) => s + c.payout, 0)
  const todaySpend = (spendToday.data ?? []).reduce((s, c) => s + c.amount, 0)
  const todayProfit = todayRevenue - todaySpend

  // Build history
  const revenueByDay: Record<string, number> = {}
  const spendByDay: Record<string, number> = {}

  ;(callsHistory.data ?? []).forEach(c => {
    const d = c.called_at.split('T')[0]
    revenueByDay[d] = (revenueByDay[d] ?? 0) + c.payout
  })
  ;(spendHistory.data ?? []).forEach(s => {
    spendByDay[s.spend_date] = (spendByDay[s.spend_date] ?? 0) + s.amount
  })

  const profitDays = Object.keys({ ...revenueByDay, ...spendByDay }).map(d => ({
    date: d,
    profit: (revenueByDay[d] ?? 0) - (spendByDay[d] ?? 0),
  }))

  const bestDay = profitDays.reduce((best, d) => d.profit > best.profit ? d : best, { date: '', profit: 0 })
  const goalDays = profitDays.filter(d => d.profit >= 200).length

  return { todayProfit, bestDay, goalDays }
}

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { todayProfit, bestDay, goalDays } = await getGoalData(user!.id)
  const goalAmount = 200
  const progress = Math.min((todayProfit / goalAmount) * 100, 100)

  return (
    <div className="p-6">
      <Header title="Goal Tracker" subtitle="$200/day progress" />

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <GoalProgress current={todayProfit} goal={goalAmount} progress={progress} />

        <div className="space-y-4">
          {/* Best day card */}
          <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-1">Best Day (30d)</p>
            <p className="font-display text-2xl font-bold text-green-brand">
              {formatCurrency(bestDay.profit)}
            </p>
            {bestDay.date && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(bestDay.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* Goal days hit */}
          <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-1">$200 Days Hit (30d)</p>
            <p className="font-display text-2xl font-bold text-white">{goalDays}</p>
            <p className="text-xs text-gray-500 mt-1">out of last 30 days</p>
          </div>

          {/* Today's status */}
          <div className={`bg-navy-light border rounded-xl p-6 ${
            todayProfit >= 200 ? 'border-green-brand/50' :
            todayProfit > 0 ? 'border-orange-brand/30' :
            'border-navy-lighter'
          }`}>
            <p className="text-sm text-gray-400 mb-1">Today&apos;s Status</p>
            <p className={`font-display text-lg font-bold ${
              todayProfit >= 200 ? 'text-green-brand' :
              todayProfit > 0 ? 'text-orange-brand' :
              'text-gray-400'
            }`}>
              {todayProfit >= 200 ? 'Goal hit!' :
               todayProfit > 0 ? `${formatCurrency(200 - todayProfit)} to go` :
               'No data yet'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
