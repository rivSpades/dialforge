import { Header } from '@/components/layout/header'
import { CallFeed } from '@/components/calls/call-feed'
import { createClient } from '@/lib/supabase/server'

export default async function CallsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: calls, error } = await supabase
    .from('calls')
    .select('*, offers(name)')
    .eq('user_id', user!.id)
    .order('called_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-6">
      <Header title="Live Call Feed" subtitle="Real-time call activity" />
      <div className="mt-6">
        <CallFeed initialCalls={calls ?? []} error={error?.message} userId={user!.id} />
      </div>
    </div>
  )
}
