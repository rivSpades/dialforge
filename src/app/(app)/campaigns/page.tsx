import { Header } from '@/components/layout/header'
import { CampaignTable } from '@/components/campaigns/campaign-table'
import { AddCampaignButton } from '@/components/campaigns/add-campaign-button'
import { createClient } from '@/lib/supabase/server'

export default async function CampaignsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <Header title="Campaigns" subtitle="Manage your active offers and traffic sources" />

      <div className="mt-6 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{(offers ?? []).length} offers</span>
        </div>
        <AddCampaignButton />
      </div>

      <CampaignTable offers={offers ?? []} error={error?.message} />
    </div>
  )
}
