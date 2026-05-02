import { useEffect, useMemo, useState } from 'react'
import { FiCalendar, FiChevronDown, FiChevronUp, FiCopy, FiLoader } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getRoadmapById } from '../lib/appwrite'

function RoadmapPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documentData, setDocumentData] = useState(null)
  const [roadmapData, setRoadmapData] = useState(null)
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: false, 3: false, 4: false })
  const [progress, setProgress] = useState({})

  useEffect(() => {
    const loadRoadmap = async () => {
      setLoading(true)
      setError('')

      try {
        const doc = await getRoadmapById(id)
        setDocumentData(doc)

        const parsed = JSON.parse(doc?.roadmapJson || '{}')
        setRoadmapData(parsed)
      } catch (err) {
        setError(err?.message || 'Could not load roadmap.')
      } finally {
        setLoading(false)
      }
    }

    loadRoadmap()
  }, [id])

  useEffect(() => {
    if (!roadmapData?.jobTitle || !Array.isArray(roadmapData?.roadmap)) {
      setProgress({})
      return
    }

    const nextProgress = {}
    roadmapData.roadmap.forEach((day) => {
      const key = `skillsnap_progress_${roadmapData.jobTitle}_day_${day.day}`
      nextProgress[day.day] = localStorage.getItem(key) === 'true'
    })
    setProgress(nextProgress)
  }, [roadmapData])

  const roadmapByWeek = useMemo(() => {
    const grouped = { 1: [], 2: [], 3: [], 4: [] }
    if (!Array.isArray(roadmapData?.roadmap)) return grouped

    roadmapData.roadmap.forEach((day) => {
      const week = Number(day.week)
      if (!grouped[week]) grouped[week] = []
      grouped[week].push(day)
    })

    Object.keys(grouped).forEach((week) => {
      grouped[week] = grouped[week].sort((a, b) => a.day - b.day)
    })

    return grouped
  }, [roadmapData])

  const difficultyColor = {
    entry: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    mid: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    senior: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
  }

  const resourceIcon = {
    video: '??',
    article: '??',
    docs: '??',
  }

  const toggleWeek = (week) => {
    setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }))
  }

  const toggleDayProgress = (day) => {
    if (!roadmapData?.jobTitle) return

    const next = !progress[day.day]
    setProgress((prev) => ({ ...prev, [day.day]: next }))

    const key = `skillsnap_progress_${roadmapData.jobTitle}_day_${day.day}`
    localStorage.setItem(key, String(next))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Roadmap link copied!')
    } catch {
      toast.error('Could not copy link.')
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <FiLoader className="mx-auto h-8 w-8 animate-spin text-[#818cf8]" />
        <p className="mt-4 text-gray-400">Loading roadmap...</p>
      </main>
    )
  }

  if (error || !roadmapData) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-rose-300">{error || 'Roadmap not found.'}</p>
        <Link to="/" className="mt-4 inline-flex rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-semibold text-white">
          Go Home
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-3 text-sm text-gray-300">
        View this roadmap on SkillSnap •{' '}
        <Link to="/" className="font-medium text-[#a5b4fc] hover:text-[#c7d2fe]">
          Go to homepage
        </Link>
      </div>

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a3a] px-4 py-2 text-sm font-medium text-gray-100 transition hover:border-[#6366f1]/70"
        >
          <FiCopy className="h-4 w-4" /> Share
        </button>
      </div>

      <section className="space-y-6">
        <article className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{roadmapData.jobTitle || documentData?.title || 'Roadmap'}</h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyColor[roadmapData.difficulty] || 'bg-gray-600/20 text-gray-300 border-gray-500/30'}`}
            >
              {roadmapData.difficulty || 'unknown'}
            </span>
          </div>
          <p className="mt-4 leading-relaxed text-gray-300">{roadmapData.summary || 'No summary available.'}</p>
        </article>

        <article className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-white">? You Likely Have</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(roadmapData.likelyHaveSkills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">?? Skill Gaps Found</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(roadmapData.gapSkills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Based on typical CS student background</p>
        </article>

        <article className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <FiCalendar className="h-5 w-5 text-[#818cf8]" />
            Your 30-Day Learning Roadmap
          </h2>

          <div className="mt-5 space-y-4">
            {[1, 2, 3, 4].map((week) => (
              <div key={week} className="overflow-hidden rounded-xl border border-[#2a2a3a] bg-[#15151e]">
                <button
                  type="button"
                  onClick={() => toggleWeek(week)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-white">Week {week}</span>
                  {expandedWeeks[week] ? (
                    <FiChevronUp className="h-4 w-4 text-gray-300" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-gray-300" />
                  )}
                </button>

                {expandedWeeks[week] ? (
                  <div className="space-y-3 border-t border-[#2a2a3a] p-4">
                    {(roadmapByWeek[week] || []).map((day) => (
                      <div key={`${week}-${day.day}`} className="rounded-lg border border-[#2a2a3a] bg-[#1a1a24] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1] text-xs font-bold text-white">
                                {day.day}
                              </span>
                              <h3 className="text-base font-semibold text-white">{day.skill}</h3>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-300">{day.task}</p>
                            <a
                              href={day.resource?.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#a5b4fc] hover:text-[#c7d2fe]"
                            >
                              <span>{resourceIcon[day.resource?.type] || '??'}</span>
                              <span>
                                {day.resource?.title || 'Open resource'} ({day.resource?.type || 'resource'})
                              </span>
                            </a>

                            <div className="mt-3 rounded-md border-l-4 border-[#6366f1] bg-[#111827]/40 px-3 py-2 text-sm text-gray-300">
                              “{day.interviewPhrase}”
                            </div>
                          </div>

                          <label className="flex items-center gap-2 text-xs text-gray-400">
                            <input
                              type="checkbox"
                              checked={Boolean(progress[day.day])}
                              onChange={() => toggleDayProgress(day)}
                              className="h-4 w-4 rounded border-[#2a2a3a] bg-[#111827] text-[#6366f1] focus:ring-[#6366f1]"
                            />
                            Done
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

export default RoadmapPage
