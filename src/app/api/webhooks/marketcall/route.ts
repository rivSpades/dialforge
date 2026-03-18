import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const ALLOWED_IPS = (process.env.MARKETCALL_ALLOWED_IPS ?? '').split(',').map(ip => ip.trim()).filter(Boolean)

function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone + process.env.MARKETCALL_WEBHOOK_SECRET).digest('hex')
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '0.0.0.0'
  )
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  // IP whitelist check (skip in development)
  if (process.env.NODE_ENV === 'production' && ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIP)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    await supabase.from('webhook_audit_log').insert({
      source_ip: clientIP,
      payload: {},
      processed: false,
      error: 'Invalid JSON',
    })
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Log the raw webhook
  const { data: logEntry } = await supabase
    .from('webhook_audit_log')
    .insert({ source_ip: clientIP, payload: body, processed: false, error: null })
    .select()
    .single()

  try {
    // Extract Marketcall postback fields
    const callIdExternal = String(body.call_id ?? body.id ?? '')
    const duration = parseInt(String(body.duration ?? body.call_duration ?? '0'), 10)
    const payout = parseFloat(String(body.payout ?? body.revenue ?? '0'))
    const statusRaw = String(body.status ?? body.call_status ?? '').toLowerCase()
    const callerRaw = String(body.caller ?? body.caller_id ?? body.ani ?? '')

    const status: 'billable' | 'non_billable' | 'duplicate' | 'fraud' =
      statusRaw === 'billable' ? 'billable' :
      statusRaw === 'duplicate' ? 'duplicate' :
      statusRaw === 'fraud' ? 'fraud' :
      'non_billable'

    const callerHash = callerRaw ? hashPhone(callerRaw) : ''

    // TCPA compliance: log hashed number
    if (callerHash) {
      await supabase.from('tcpa_compliance_log').insert({
        caller_hash: callerHash,
        action: 'postback_received',
        metadata: { status, duration, payout },
      })
    }

    // Insert call record (need to find the user — use service role to find by offer match or default)
    // For MVP: require user_id in postback or use a single-user setup
    const userId = String(body.user_id ?? body.sub_id ?? '')

    if (!userId) {
      throw new Error('Missing user_id in postback payload')
    }

    await supabase.from('calls').insert({
      user_id: userId,
      offer_id: body.offer_id ? String(body.offer_id) : null,
      call_id_external: callIdExternal,
      duration_seconds: duration,
      status,
      payout: status === 'billable' ? payout : 0,
      caller_hash: callerHash,
      called_at: body.called_at ? String(body.called_at) : new Date().toISOString(),
      raw_payload: body,
    })

    // Mark audit log as processed
    if (logEntry?.id) {
      await supabase.from('webhook_audit_log').update({ processed: true }).eq('id', logEntry.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    if (logEntry?.id) {
      await supabase.from('webhook_audit_log').update({ processed: false, error: errorMessage }).eq('id', logEntry.id)
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
