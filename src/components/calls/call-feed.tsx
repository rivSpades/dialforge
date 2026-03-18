'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Phone, PhoneOff, Clock } from 'lucide-react'

interface Call {
  id: string
  call_id_external: string
  duration_seconds: number
  status: string
  payout: number
  called_at: string
  offers?: { name: string } | null
}

interface CallFeedProps {
  initialCalls: Call[]
  error?: string
  userId: string
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function CallFeed({ initialCalls, error, userId }: CallFeedProps) {
  const [calls, setCalls] = useState<Call[]>(initialCalls)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('calls-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'calls', filter: `user_id=eq.${userId}` },
        (payload) => {
          setCalls(prev => [payload.new as Call, ...prev].slice(0, 100))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  if (error) {
    return (
      <div className="bg-navy-light border border-orange-brand/30 rounded-xl p-8 text-center">
        <p className="text-orange-brand text-sm font-medium">Failed to load calls</p>
        <p className="text-gray-500 text-xs mt-1">{error}</p>
      </div>
    )
  }

  if (calls.length === 0) {
    return (
      <div className="bg-navy-light border border-navy-lighter rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-navy-lighter flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="font-display font-semibold text-white mb-2">Waiting for calls</h3>
        <p className="text-gray-400 text-sm">
          Calls will appear here in real-time once your Marketcall webhook is configured.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-500 bg-navy-lighter rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5" />
          Listening for new calls...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl overflow-hidden">
      <div className="px-6 py-3 border-b border-navy-lighter flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-brand animate-pulse" />
        <span className="text-xs text-gray-400 font-medium">Live — {calls.length} calls loaded</span>
      </div>
      <div className="divide-y divide-navy-lighter">
        {calls.map((call) => (
          <div key={call.id} className="flex items-center gap-4 px-6 py-3 hover:bg-navy-lighter/30 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              call.status === 'billable' ? 'bg-green-brand/20' : 'bg-orange-brand/20'
            }`}>
              {call.status === 'billable'
                ? <Phone className="w-4 h-4 text-green-brand" />
                : <PhoneOff className="w-4 h-4 text-orange-brand" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">
                  {call.offers?.name ?? 'Unknown offer'}
                </span>
                <Badge variant={call.status === 'billable' ? 'success' : 'error'}>
                  {call.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(call.duration_seconds)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(call.called_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`font-display font-semibold text-sm ${
                call.payout > 0 ? 'text-green-brand' : 'text-gray-400'
              }`}>
                {call.payout > 0 ? formatCurrency(call.payout) : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
