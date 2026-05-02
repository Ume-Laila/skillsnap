import { useState } from 'react'
import { FiLoader, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getCurrentUser, loginUser, signupUser } from '../lib/auth'

function LoginModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inlineError, setInlineError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setInlineError('')
    setIsSignup(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setInlineError('')

    if (!email.trim() || !password.trim() || (isSignup && !name.trim())) {
      setInlineError('Please fill in all required fields.')
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignup) {
        await signupUser(name.trim(), email.trim(), password)
      } else {
        await loginUser(email.trim(), password)
      }

      const user = await getCurrentUser()
      await onAuthSuccess(user)
      toast.success(isSignup ? 'Account created successfully!' : 'Logged in successfully!')
      handleClose()
    } catch (error) {
      const message = error?.message || 'Authentication failed. Please try again.'
      setInlineError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-6 shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition hover:bg-[#2a2a3a] hover:text-white"
          aria-label="Close login modal"
        >
          <FiX className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-white">Save Your Roadmap</h2>
        <p className="mt-2 text-sm text-gray-400">Create a free account to save and access your roadmaps</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup ? (
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-gray-200">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
                placeholder="Your name"
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
              placeholder="••••••••"
            />
          </div>

          {inlineError ? <p className="text-sm text-rose-300">{inlineError}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignup((prev) => !prev)
            setInlineError('')
          }}
          className="mt-4 text-sm text-[#a5b4fc] transition hover:text-[#c7d2fe]"
        >
          {isSignup ? 'Already have an account? Login instead' : 'Sign up instead'}
        </button>
      </div>
    </div>
  )
}

export default LoginModal
