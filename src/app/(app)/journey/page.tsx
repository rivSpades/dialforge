import { Header } from '@/components/layout/header'
import { JourneyTimeline } from '@/components/journey/journey-timeline'
import { createClient } from '@/lib/supabase/server'

async function getWeeklyJourneyData(userId: string) {
  const supabase = await createClient()

  // Get last 7 days
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  const startDate = weekAgo.toISOString().split('T')[0]

  const [callsResult, spendResult] = await Promise.all([
    supabase
      .from('calls')
      .select('payout, status, called_at, offers(name)')
      .eq('user_id', userId)
      .gte('called_at', `${startDate}T00:00:00`)
      .order('called_at', { ascending: false }),
    supabase
      .from('daily_spend')
      .select('amount, spend_date, notes')
      .eq('user_id', userId)
      .gte('spend_date', startDate)
      .order('spend_date', { ascending: false }),
  ])

  // Build day-by-day summary
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  }).reverse()

  const callsByDay: Record<string, { revenue: number; count: number }> = {}
  const spendByDay: Record<string, number> = {}
  days.forEach(d => { callsByDay[d] = { revenue: 0, count: 0 }; spendByDay[d] = 0 })

  ;(callsResult.data ?? []).forEach(c => {
    const day = c.called_at.split('T')[0]
    if (callsByDay[day]) {
      if (c.status === 'billable') {
        callsByDay[day].revenue += c.payout
        callsByDay[day].count++
      }
    }
  })

  ;(spendResult.data ?? []).forEach(s => {
    if (spendByDay[s.spend_date] !== undefined) spendByDay[s.spend_date] += s.amount
  })

  return days.map(d => ({
    date: d,
    revenue: callsByDay[d].revenue,
    spend: spendByDay[d],
    profit: callsByDay[d].revenue - spendByDay[d],
    callCount: callsByDay[d].count,
  })).reverse()
}

export default async function JourneyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const days = await getWeeklyJourneyData(user!.id)

  return (
    <div className="p-6">
      <Header title="Journey Log" subtitle="Weekly performance timeline" />
      <div className="mt-6">
        <JourneyTimeline days={days} />
      </div>
    </div>
  )
}
