# Architecture spec

The stack is optimized for a solo operator: fast to build, cheap to run, no overengineering.

- Frontend: Next.js 14 (App Router) with TypeScript and Tailwind CSS, hosted on Vercel
- Backend: Next.js API Routes for webhook ingestion, Supabase Edge Functions for background processing
- Database: Supabase (PostgreSQL) with Row Level Security enabled on all tables
- Auth: Supabase Auth (email/password + OAuth) — built-in, no third-party auth service needed
- Email Alerts: Resend API (free tier covers MVP)
- Payments: None needed — revenue comes from Marketcall affiliate payouts, not from end users

Database has 6 core tables: profiles, offers, calls, daily_spend, tcpa_compliance_log, and webhook_audit_log. All postback data is stored with raw payload for audit trails. Phone numbers are stored as hashes only, never in raw form.

The webhook ingestion endpoint validates Marketcall postbacks via IP whitelisting and parameter verification before writing to the calls table. Ad spend is entered manually in MVP, then automated via Facebook Marketing API and Google Ads API in V1.

The entire stack runs on free tiers during MVP. Production cost at scale: $45–70/month.
