import Link from 'next/link'
import { Zap, TrendingUp, Phone, Target, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Daily P&L Dashboard',
    description: 'Real-time spend vs revenue with margin tracking and a sparkline progress toward your $200/day goal.',
  },
  {
    icon: TrendingUp,
    title: 'Campaign Manager',
    description: 'Track active campaigns with payout rates, traffic sources, CPL, and one-click status toggles.',
  },
  {
    icon: Phone,
    title: 'Live Call Feed',
    description: 'Real-time call ticker showing duration, status, and payout as each call completes.',
  },
  {
    icon: BarChart3,
    title: 'Journey Log',
    description: 'Weekly timeline of your performance — color-coded wins, losses, and key milestones.',
  },
  {
    icon: Target,
    title: 'Goal Tracker',
    description: 'Visual progress ring toward your $200/day target with milestone markers at $50, $100, $150, $200.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Nav */}
      <nav className="border-b border-navy-lighter">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-brand flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">DialForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-orange-brand hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-navy-lighter border border-navy-lighter rounded-full px-4 py-1.5 text-sm text-gray-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-brand animate-pulse" />
          Built for pay-per-call affiliates
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Stop guessing.<br />
          <span className="text-orange-brand">Start forging profit.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          DialForge is your real-time P&L command center for Marketcall campaigns.
          Track spend, revenue, and margins — all in one obsessively focused dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="flex items-center gap-2 bg-orange-brand hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start tracking free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="text-gray-400 hover:text-white font-medium px-6 py-3 transition-colors"
          >
            Sign in →
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-navy-lighter bg-navy-light">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Daily Goal', value: '$200/day' },
            { label: 'Stack', value: 'Free Tier' },
            { label: 'Data Ownership', value: '100% Yours' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Everything you need to hit your number
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Five focused screens that tell you exactly what&apos;s working, what&apos;s not, and how close you are to your daily target.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-navy-light border border-navy-lighter rounded-xl p-6 hover:border-orange-brand/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-lighter flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-orange-brand" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-navy-light border border-navy-lighter rounded-2xl p-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white mb-6">
              Built by an affiliate, for affiliates
            </h2>
            <div className="space-y-3 mb-8">
              {[
                'Supabase webhooks ingest Marketcall postbacks automatically',
                'Phone numbers stored as hashes only — full TCPA compliance built-in',
                'Row-level security so your data stays yours',
                'Runs on free tiers during MVP — scales to $45/mo at full throttle',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-brand flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{point}</span>
                </div>
              ))}
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-orange-brand hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Get your dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-lighter">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm">DialForge</span>
          </div>
          <p className="text-xs text-gray-500">© 2026 DialForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
