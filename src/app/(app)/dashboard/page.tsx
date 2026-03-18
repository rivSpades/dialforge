import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/ui/stat-card'
import { DailyPnLChart } from '@/components/dashboard/daily-pnl-chart'
import { GoalProgress } from '@/components/dashboard/goal-progress'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatPercent } from '@/lib/utils'

async function getDashboardData(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [callsResult, spendResult] = await Promise.all([
    supabase
      .from('calls')
      .select('payout, called_at')
      .eq('user_id', userId)
      .eq('status', 'billable')
      .gte('called_at', `${today}T00:00:00`),
    supabase
      .from('daily_spend')
      .select('amount')
      .eq('user_id', userId)
      .eq('spend_date', today),
  ])

  const todayRevenue = (callsResult.data ?? []).reduce((sum, c) => sum + c.payout, 0)
  const todaySpend = (spendResult.data ?? []).reduce((sum, s) => sum + s.amount, 0)
  const todayProfit = todayRevenue - todaySpend
  const margin = todayRevenue > 0 ? (todayProfit / todayRevenue) * 100 : 0

  return { todayRevenue, todaySpend, todayProfit, margin }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { todayRevenue, todaySpend, todayProfit, margin } = await getDashboardData(user!.id)

  const goalAmount = 200
  const goalProgress = Math.min((todayProfit / goalAmount) * 100, 100)

  return (
    <div className="p-6">
      <Header
        title="Dashboard"
        subtitle={`Today — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          change="Billable calls"
          changeType="positive"
        />
        <StatCard
          label="Today's Spend"
          value={formatCurrency(todaySpend)}
          change="Ad spend"
          changeType="neutral"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(todayProfit)}
          change={todayProfit >= 0 ? 'Profitable' : 'In the red'}
          changeType={todayProfit >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          label="Margin"
          value={formatPercent(margin)}
          change="Revenue margin"
          changeType={margin >= 30 ? 'positive' : margin > 0 ? 'neutral' : 'negative'}
        />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyPnLChart userId={user!.id} />
        </div>
        <div>
          <GoalProgress current={todayProfit} goal={goalAmount} progress={goalProgress} />
        </div>
      </div>
    </div>
  )
}
