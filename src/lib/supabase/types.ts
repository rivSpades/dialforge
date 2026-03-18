export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          daily_goal: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      offers: {
        Row: {
          id: string
          user_id: string
          name: string
          traffic_source: string
          payout_per_call: number
          status: 'active' | 'paused' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['offers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['offers']['Insert']>
      }
      calls: {
        Row: {
          id: string
          user_id: string
          offer_id: string | null
          call_id_external: string
          duration_seconds: number
          status: 'billable' | 'non_billable' | 'duplicate' | 'fraud'
          payout: number
          caller_hash: string
          called_at: string
          raw_payload: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['calls']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['calls']['Insert']>
      }
      daily_spend: {
        Row: {
          id: string
          user_id: string
          offer_id: string | null
          spend_date: string
          amount: number
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['daily_spend']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['daily_spend']['Insert']>
      }
      tcpa_compliance_log: {
        Row: {
          id: string
          caller_hash: string
          action: string
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tcpa_compliance_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tcpa_compliance_log']['Insert']>
      }
      webhook_audit_log: {
        Row: {
          id: string
          source_ip: string
          payload: Json
          processed: boolean
          error: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['webhook_audit_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['webhook_audit_log']['Insert']>
      }
    }
  }
}
