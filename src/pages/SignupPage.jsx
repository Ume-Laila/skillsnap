import { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signupUser } from '../lib/auth'

function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Sign Up | SkillSnap'
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.')
      return
    }

    setLoading(true)
    try {
      await signupUser(name.trim(), email.trim(), password)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter grid min-h-[calc(100vh-64px)] bg-[#0f0f13] lg:grid-cols-2">
      <section className="flex items-center justify-center px-4 py-10 sm:px-8 sm:py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-6 shadow-2xl shadow-black/20 sm:p-7">
          <h2 className="text-2xl font-bold text-white">Create Your Free Account</h2>
          <p className="mt-2 text-sm text-gray-400">Start saving and tracking your personalized roadmaps.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-200">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-[#2a2a3a] bg-[#11131a] px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
                placeholder="Your name"
              />
            </div>

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
                placeholder="********"
              />
            </div>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
              Create Free Account
            </button>
          </form>

          <p className="mt-5 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#a5b4fc] hover:text-[#c7d2fe]">
              Login
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#312e81] via-[#3730a3] to-[#1e1b4b]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10rem] top-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[#6366f1]/30 blur-3xl" />
          <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[#f59e0b]/30 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-lg px-8">
          <h1 className="text-5xl font-bold leading-tight text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            Your career gap ends today.
          </h1>
          <p className="mt-5 text-lg text-indigo-100">
            Join thousands of students closing skill gaps for free.
          </p>
        </div>
      </section>
    </div>
  )
}

export default SignupPage
