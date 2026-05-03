import { useEffect, useMemo, useState } from 'react'
import {
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiLoader,
  FiRefreshCcw,
  FiSave,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import LoginModal from '../components/LoginModal'
import { getCurrentUser } from '../lib/auth'
import { saveRoadmap } from '../lib/appwrite'
import { analyzeJob } from '../lib/gemini'

const MAX_CHARACTERS = 5000
const LOADING_MESSAGES = [
  'Reading job requirements...',
  'Finding your skill gaps...',
  'Building your roadmap...',
  'Almost ready...',
]

const EXAMPLE_JOBS = {
  frontend:
    'We are hiring a Frontend Developer to build intuitive, accessible interfaces for our SaaS platform. You will work with product, design, and backend teams to implement features across dashboards, reporting flows, and onboarding experiences. Strong knowledge of HTML, CSS, JavaScript, and responsive design is required. You should be comfortable with React, reusable component architecture, hooks, and modern state patterns. We value experience with API integration, async data handling, and performance optimization. Familiarity with Tailwind CSS, TypeScript, and testing tools such as Jest or React Testing Library is a plus. You will translate Figma designs into production-ready UI, improve cross-browser compatibility, and maintain consistency in our design system. Candidate should have problem-solving ability, attention to detail, and clear communication. Bonus points for experience with accessibility standards, animation libraries, and CI/CD workflows. This role offers mentorship, growth opportunities, and a collaborative engineering culture focused on clean code and measurable user impact.',
  dataAnalyst:
    'We are seeking a Data Analyst to help our team make faster, data-driven decisions across marketing, product, and operations. In this role, you will collect, clean, and analyze datasets from multiple sources to identify trends and opportunities. You will build reports and dashboards, present findings to stakeholders, and translate business questions into measurable metrics. Strong SQL skills are required, including joins, aggregations, and query optimization. You should also be comfortable using spreadsheets and a BI tool such as Tableau, Power BI, or Looker. Knowledge of Python for analysis and automation is highly preferred, especially pandas, data visualization, and basic statistics. Experience with A/B testing, KPI definitions, and funnel analysis is valuable. We are looking for someone who communicates insights clearly, documents assumptions, and can prioritize tasks in a fast-moving environment. Attention to detail, curiosity, and ownership are essential. This is an opportunity to shape key decisions and build analytical processes from the ground up with cross-functional teams.',
  backend:
    'Our company is looking for a Backend Developer to build reliable APIs and services that power our web applications. You will design and implement RESTful endpoints, integrate databases, and ensure application performance, security, and scalability. Required skills include strong JavaScript or Python fundamentals, Node.js or Django/Flask experience, and working knowledge of relational databases such as PostgreSQL or MySQL. You should understand data modeling, indexing, transactions, and query performance. Familiarity with authentication, authorization, and secure coding best practices is expected. Experience with caching, background jobs, and message queues is a plus. You will collaborate with frontend engineers to define contracts, debug production issues, and monitor service health. We value clean architecture, automated testing, and maintainable code. Exposure to Docker, cloud deployment, and CI/CD pipelines is beneficial. The ideal candidate is proactive, communicates tradeoffs clearly, and enjoys building systems that are dependable under real-world load. This role offers ownership and significant technical growth in a supportive engineering team.',
}

function AnalyzePage() {
  const [skillsBackground, setSkillsBackground] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [expandedWeeks, setExpandedWeeks] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
  })
  const [progress, setProgress] = useState({})
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading) return undefined
    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 2000)
    return () => window.clearInterval(intervalId)
  }, [loading])

  useEffect(() => {
    if (!result?.jobTitle || !Array.isArray(result?.roadmap)) {
      setProgress({})
      return
    }
    const nextProgress = {}
    result.roadmap.forEach((day) => {
      const key = `skillsnap_progress_${result.jobTitle}_day_${day.day}`
      nextProgress[day.day] = localStorage.getItem(key) === 'true'
    })
    setProgress(nextProgress)
  }, [result])

  const mergedPrompt = useMemo(() => {
    if (!skillsBackground.trim()) return jobDescription
    return `Candidate background: ${skillsBackground}\n\nJob description:\n${jobDescription}`
  }, [skillsBackground, jobDescription])

  const roadmapByWeek = useMemo(() => {
    const grouped = { 1: [], 2: [], 3: [], 4: [] }
    if (!Array.isArray(result?.roadmap)) return grouped
    result.roadmap.forEach((day) => {
      const week = Number(day.week)
      if (!grouped[week]) grouped[week] = []
      grouped[week].push(day)
    })
    Object.keys(grouped).forEach((week) => {
      grouped[week] = grouped[week].sort((a, b) => a.day - b.day)
    })
    return grouped
  }, [result])

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.')
      return
    }
    if (jobDescription.length > MAX_CHARACTERS) {
      toast.error('Job description is too long. Keep it under 5000 characters.')
      return
    }
    setLoading(true)
    setLoadingMessageIndex(0)
    setShowResults(false)
    try {
      const analysis = await analyzeJob(mergedPrompt)
      setResult(analysis)
      setExpandedWeeks({ 1: true, 2: false, 3: false, 4: false })
      setShowResults(true)
      toast.success('Roadmap generated successfully!')
    } catch (error) {
      toast.error(error?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleDayProgress = (day) => {
    if (!result?.jobTitle) return
    const next = !progress[day.day]
    setProgress((prev) => ({ ...prev, [day.day]: next }))
    const key = `skillsnap_progress_${result.jobTitle}_day_${day.day}`
    localStorage.setItem(key, String(next))
  }

  const executeSave = async (currentUser) => {
    if (!result) return toast.error('No roadmap available to save yet.')
    const userId = currentUser?.$id
    if (!userId) return toast.error('Unable to detect user account. Please login again.')
    setIsSaving(true)
    try {
      await saveRoadmap(userId, result.jobTitle || 'Untitled roadmap', jobDescription, {
        ...result,
        progress,
      })
      toast.success('Roadmap saved successfully!')
    } catch (error) {
      toast.error(error?.message || 'Failed to save roadmap.')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveRoadmap = async () => {
    if (!result) return toast.error('Run analysis first to save your roadmap.')
    try {
      const currentUser = await getCurrentUser()
      await executeSave(currentUser)
    } catch {
      setIsLoginModalOpen(true)
    }
  }

  const difficultyColor = {
    entry: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    mid: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    senior: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
  }

  const resourceIcon = { video: '📺', article: '📄', docs: '📚' }

  return (
    <main className="page-enter mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="text-2xl font-bold text-white sm:text-4xl">Analyze a Job Description</h1>
      <p className="mt-3 text-sm text-gray-400 sm:text-base">
        Paste any job posting and get your personalized 30-day roadmap
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="skillsBackground" className="mb-2 block text-sm font-medium text-gray-200">
            Your Current Skills (Optional)
          </label>
          <textarea
            id="skillsBackground"
            value={skillsBackground}
            onChange={(event) => setSkillsBackground(event.target.value)}
            placeholder="e.g. I know HTML, CSS, basic JavaScript, React basics..."
            className="w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="mb-2 block text-sm font-medium text-gray-200">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value.slice(0, MAX_CHARACTERS))}
            placeholder="Paste the full job description here..."
            className="min-h-[200px] w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40"
          />
          <p className="mt-2 text-right text-xs text-gray-500">
            {jobDescription.length}/{MAX_CHARACTERS}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setJobDescription(EXAMPLE_JOBS.frontend)}
            className="rounded-full border border-[#2a2a3a] px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-[#6366f1]/70 hover:text-white"
          >
            Try: Frontend Dev
          </button>
          <button
            type="button"
            onClick={() => setJobDescription(EXAMPLE_JOBS.dataAnalyst)}
            className="rounded-full border border-[#2a2a3a] px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-[#6366f1]/70 hover:text-white"
          >
            Try: Data Analyst
          </button>
          <button
            type="button"
            onClick={() => setJobDescription(EXAMPLE_JOBS.backend)}
            className="rounded-full border border-[#2a2a3a] px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-[#6366f1]/70 hover:text-white"
          >
            Try: Backend Dev
          </button>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-6 py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <FiLoader className="h-5 w-5 animate-spin" /> : null}
          {loading ? LOADING_MESSAGES[loadingMessageIndex] : 'Analyze Now ⚡'}
        </button>
      </div>

      {showResults && result ? (
        <section className="mt-10 space-y-6">
          <article className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-white sm:text-2xl">{result.jobTitle || 'Detected Role'}</h2>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  difficultyColor[result.difficulty] || 'bg-gray-600/20 text-gray-300 border-gray-500/30'
                }`}
              >
                {result.difficulty || 'unknown'}
              </span>
            </div>
            <p className="mt-4 leading-relaxed text-gray-300">{result.summary || 'No summary returned by AI.'}</p>
          </article>

          <article className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">✅ You Likely Have</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(result.likelyHaveSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">⚠️ Skill Gaps Found</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(result.gapSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">Based on typical CS student background</p>
          </article>

          <article className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <FiCalendar className="h-5 w-5 text-[#818cf8]" />
              Your 30-Day Learning Roadmap
            </h3>

            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((week) => (
                <div key={week} className="overflow-hidden rounded-xl border border-[#2a2a3a] bg-[#15151e]">
                  <button
                    type="button"
                    onClick={() => setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }))}
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
                                <h4 className="text-base font-semibold text-white">{day.skill}</h4>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-300">{day.task}</p>
                              <a
                                href={day.resource?.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#a5b4fc] hover:text-[#c7d2fe]"
                              >
                                <span>{resourceIcon[day.resource?.type] || '🔗'}</span>
                                <span>
                                  {day.resource?.title || 'Open resource'} ({day.resource?.type || 'resource'})
                                </span>
                              </a>
                              <div className="mt-3 rounded-md border-l-4 border-[#6366f1] bg-[#111827]/40 px-3 py-2 text-sm text-gray-300">
                                "{day.interviewPhrase}"
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

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleSaveRoadmap}
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70 sm:w-auto"
            >
              {isSaving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiSave className="h-4 w-4" />} 💾 Save
              Roadmap
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a3a] px-4 py-2.5 text-sm font-medium text-gray-100 sm:w-auto"
            >
              <FiCopy className="h-4 w-4" /> 🔗 Copy Link
            </button>
            <button
              type="button"
              onClick={() => {
                setSkillsBackground('')
                setJobDescription('')
                setResult(null)
                setShowResults(false)
                setProgress({})
                setExpandedWeeks({ 1: true, 2: false, 3: false, 4: false })
                toast.success('Ready for a new analysis.')
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a3a] px-4 py-2.5 text-sm font-medium text-gray-100 sm:w-auto"
            >
              <FiRefreshCcw className="h-4 w-4" /> 🔄 Analyze Another
            </button>
          </div>
        </section>
      ) : null}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthSuccess={async (currentUser) => {
          await executeSave(currentUser)
          setIsLoginModalOpen(false)
        }}
      />
    </main>
  )
}

export default AnalyzePage
