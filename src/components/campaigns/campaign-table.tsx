'use client'

import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { ToggleLeft, ToggleRight, Plus } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type Offer = Database['public']['Tables']['offers']['Row']

interface CampaignTableProps {
  offers: Offer[]
  error?: string
}

export function CampaignTable({ offers, error }: CampaignTableProps) {
  if (error) {
    return (
      <div className="bg-navy-light border border-orange-brand/30 rounded-xl p-8 text-center">
        <p className="text-orange-brand text-sm font-medium mb-1">Failed to load campaigns</p>
        <p className="text-gray-500 text-xs">{error}</p>
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="bg-navy-light border border-navy-lighter rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-navy-lighter flex items-center justify-center mx-auto mb-4">
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="font-display font-semibold text-white mb-2">No campaigns yet</h3>
        <p className="text-gray-400 text-sm mb-4">Add your first Marketcall offer to start tracking performance.</p>
      </div>
    )
  }

  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-navy-lighter">
            <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">Offer</th>
            <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">Traffic Source</th>
            <th className="text-right text-xs font-medium text-gray-400 px-6 py-3">Payout/Call</th>
            <th className="text-center text-xs font-medium text-gray-400 px-6 py-3">Status</th>
            <th className="text-center text-xs font-medium text-gray-400 px-6 py-3">Toggle</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="border-b border-navy-lighter last:border-0 hover:bg-navy-lighter/30 transition-colors">
              <td className="px-6 py-4">
                <span className="font-medium text-white text-sm">{offer.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-400 text-sm">{offer.traffic_source}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-display font-semibold text-green-brand text-sm">
                  {formatCurrency(offer.payout_per_call)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <Badge
                  variant={
                    offer.status === 'active' ? 'success' :
                    offer.status === 'paused' ? 'warning' : 'default'
                  }
                >
                  {offer.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-center">
                <button className="text-gray-400 hover:text-white transition-colors">
                  {offer.status === 'active'
                    ? <ToggleRight className="w-6 h-6 text-green-brand" />
                    : <ToggleLeft className="w-6 h-6" />
                  }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
