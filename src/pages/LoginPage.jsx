import { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginUser } from '../lib/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Login | SkillSnap'
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      await loginUser(email.trim(), password)
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-64px)] bg-[#0f0f13] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
        <style>{`
          @keyframes authBlobA {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(50px, -30px) scale(1.08); }
          }
          @keyframes authBlobB {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-60px, 40px) scale(1.14); }
          }
        `}</style>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10rem] top-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#6366f1]/20 blur-3xl [animation:authBlobA_16s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-10rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#f59e0b]/20 blur-3xl [animation:authBlobB_18s_ease-in-out_infinite]" />
        </div>

        <div className="relative z-10 mx-auto max-w-lg px-8">
          <h1 className="text-5xl font-bold leading-tight text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            Your career gap ends today.
          </h1>
          <p className="mt-5 text-lg text-gray-300">
            Join thousands of students closing skill gaps for free.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-7 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">Login to continue your roadmap journey.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#2a2a3a] bg-[#11131a] px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#2a2a3a] bg-[#11131a] px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
              Login
            </button>
          </form>

          <p className="mt-5 text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-[#a5b4fc] hover:text-[#c7d2fe]">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default LoginPage
