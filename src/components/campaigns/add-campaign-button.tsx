'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, X } from 'lucide-react'

export function AddCampaignButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [trafficSource, setTrafficSource] = useState('')
  const [payout, setPayout] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('offers').insert({
      user_id: user!.id,
      name,
      traffic_source: trafficSource,
      payout_per_call: parseFloat(payout),
      status: 'active',
    })

    setLoading(false)
    setOpen(false)
    setName(''); setTrafficSource(''); setPayout('')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-orange-brand hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Campaign
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-navy-light border border-navy-lighter rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-white">Add Campaign</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Offer Name</label>
                <input
                  value={name} onChange={e => setName(e.target.value)} required
                  placeholder="e.g. Medicare - Google Ads"
                  className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-brand text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Traffic Source</label>
                <input
                  value={trafficSource} onChange={e => setTrafficSource(e.target.value)} required
                  placeholder="e.g. Google Ads"
                  className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-brand text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Payout Per Call ($)</label>
                <input
                  type="number" step="0.01" min="0"
                  value={payout} onChange={e => setPayout(e.target.value)} required
                  placeholder="e.g. 18.50"
                  className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-brand text-sm"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-brand hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
