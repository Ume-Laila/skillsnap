import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="page-enter flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16 text-center">
      <div className="max-w-xl">
        <p className="bg-gradient-to-r from-[#818cf8] to-[#4f46e5] bg-clip-text text-7xl font-extrabold text-transparent sm:text-8xl">
          404
        </p>
        <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">Lost in the job market?</h1>
        <p className="mt-3 text-gray-400">This page doesn't exist.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-8 rounded-lg bg-[#6366f1] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Go Home
        </button>
      </div>
    </main>
  )
}

export default NotFoundPage
