import { useEffect, useMemo, useState } from 'react'
import { FiLogOut, FiTrash2 } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { deleteRoadmap, getUserRoadmaps } from '../lib/appwrite'
import { getCurrentUser, logoutUser } from '../lib/auth'

function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [roadmaps, setRoadmaps] = useState([])

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        const data = await getUserRoadmaps(currentUser.$id)
        setRoadmaps(data?.documents || [])
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [navigate])

  const parsedRoadmaps = useMemo(() => {
    return roadmaps.map((doc) => {
      let parsed = {}
      try {
        parsed = JSON.parse(doc.roadmapJson || '{}')
      } catch {
        parsed = {}
      }

      const roadmapDays = Array.isArray(parsed?.roadmap) ? parsed.roadmap : []
      const uniqueSkills = new Set(roadmapDays.map((item) => item.skill).filter(Boolean)).size
      const titleForProgress = parsed?.jobTitle || doc.jobTitle || doc.title || 'roadmap'
      const completedDays = roadmapDays.filter((day) => {
        const key = `skillsnap_progress_${titleForProgress}_day_${day.day}`
        return localStorage.getItem(key) === 'true'
      }).length

      return {
        ...doc,
        parsed,
        uniqueSkills,
        completedDays,
        totalDays: roadmapDays.length || 30,
      }
    })
  }, [roadmaps])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this roadmap permanently?')
    if (!confirmed) return

    try {
      await deleteRoadmap(id)
      setRoadmaps((prev) => prev.filter((doc) => doc.$id !== id))
      toast.success('Roadmap deleted.')
    } catch (error) {
      toast.error(error?.message || 'Failed to delete roadmap.')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('Logged out successfully.')
      navigate('/')
    } catch (error) {
      toast.error(error?.message || 'Logout failed.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name || 'Learner'} ??
          </h1>
          <p className="mt-2 text-gray-400">Your saved roadmaps</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a3a] px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-[#6366f1]/70"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-5">
              <div className="h-5 w-2/3 rounded bg-[#2a2a3a]" />
              <div className="mt-3 h-3 w-1/2 rounded bg-[#2a2a3a]" />
              <div className="mt-5 h-2 w-full rounded bg-[#2a2a3a]" />
              <div className="mt-6 h-9 w-full rounded bg-[#2a2a3a]" />
            </div>
          ))}
        </div>
      ) : null}

      {!loading && parsedRoadmaps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2a2a3a] bg-[#15151e] p-10 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6366f1]/20 text-xl">
            ??
          </div>
          <h2 className="text-xl font-semibold text-white">No roadmaps saved yet</h2>
          <p className="mt-2 text-gray-400">Start by analyzing a role you want to break into.</p>
          <Link
            to="/analyze"
            className="mt-5 inline-flex rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Analyze your first job ?
          </Link>
        </div>
      ) : null}

      {!loading && parsedRoadmaps.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parsedRoadmaps.map((doc) => {
            const percentage = Math.min(100, Math.round((doc.completedDays / doc.totalDays) * 100))
            const savedDate = doc.createdAt || doc.$createdAt

            return (
              <article key={doc.$id} className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-5">
                <h3 className="line-clamp-2 text-lg font-semibold text-white">{doc.title || doc.jobTitle || 'Untitled roadmap'}</h3>
                <p className="mt-2 text-xs text-gray-400">
                  Saved {savedDate ? new Date(savedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'recently'}
                </p>
                <p className="mt-3 text-sm text-gray-300">{doc.uniqueSkills} skills in roadmap</p>

                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-400">
                    {doc.completedDays} of {doc.totalDays} days completed
                  </p>
                  <div className="h-2 w-full rounded-full bg-[#111827]">
                    <div className="h-2 rounded-full bg-[#6366f1]" style={{ width: `${percentage}%` }} />
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/roadmap/${doc.$id}`)}
                    className="flex-1 rounded-lg bg-[#6366f1] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    View Roadmap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.$id)}
                    className="inline-flex items-center justify-center rounded-lg border border-[#2a2a3a] px-3 py-2 text-gray-200 transition hover:border-rose-400/60 hover:text-rose-300"
                    aria-label="Delete roadmap"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </main>
  )
}

export default DashboardPage
