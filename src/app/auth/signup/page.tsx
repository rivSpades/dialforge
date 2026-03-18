'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  // Suppress unused variable warning - router is used for potential future redirect
  void router

  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-brand/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-brand" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-400 text-sm">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link href="/auth/login" className="inline-block mt-6 text-orange-brand hover:underline text-sm">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-brand flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">DialForge</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Create your free account</p>
        </div>

        <div className="bg-navy-light border border-navy-lighter rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-orange-brand/10 border border-orange-brand/30 rounded-lg text-orange-brand text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-brand transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-brand transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-brand transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-brand hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-brand hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
