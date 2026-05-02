import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheckCircle,
  FiClipboard,
  FiMap,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi'

function HomePage() {
  const navigate = useNavigate()
  const howItWorksRef = useRef(null)

  const goToAnalyze = () => {
    navigate('/analyze')
  }

  const scrollToExample = () => {
    navigate('/', { replace: true })
    setTimeout(() => {
      howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <div className="relative overflow-hidden bg-[#0f0f13] text-white">
      <style>{`
        @keyframes blobFloatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(70px, -40px) scale(1.08); }
        }

        @keyframes blobFloatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, 50px) scale(1.12); }
        }
      `}</style>

      <section className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#6366f1]/15 blur-3xl [animation:blobFloatA_16s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-10rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#f59e0b]/15 blur-3xl [animation:blobFloatB_18s_ease-in-out_infinite]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/70 bg-[#6366f1]/10 px-4 py-2 text-sm font-medium text-[#818cf8]">
            <span>&#9889;</span>
            Free AI-Powered Career Tool
          </span>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Paste a Job. Know Your Gap.
            <span className="mt-2 block bg-gradient-to-r from-[#818cf8] via-[#6366f1] to-[#4f46e5] bg-clip-text text-transparent">
              Fix It in 30 Days.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
            SkillSnap analyzes any job description, finds your skill gaps, and builds you a personalized free
            learning roadmap - instantly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={goToAnalyze}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6366f1] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#6366f1]/30 transition hover:brightness-110"
            >
              Analyze a Job
              <FiArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollToExample}
              className="inline-flex items-center rounded-xl border border-[#2a2a3a] bg-[#15151e] px-8 py-4 text-base font-semibold text-gray-100 transition hover:border-[#6366f1]/70 hover:text-white"
            >
              See Example
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-400">100% free. No signup required to try.</p>
        </div>
      </section>

      <section ref={howItWorksRef} className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <p className="mt-3 text-gray-400">Three simple steps from job post to clear learning plan.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              number: '01',
              title: 'Paste Job Description',
              icon: FiClipboard,
              description: 'Drop in any role description from a job board or company site.',
            },
            {
              number: '02',
              title: 'AI Finds Your Gaps',
              icon: FiZap,
              description: 'SkillSnap identifies what you already know and what to improve.',
            },
            {
              number: '03',
              title: 'Get Your Roadmap',
              icon: FiMap,
              description: 'Receive a practical 30-day plan with daily tasks and resources.',
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.number}
                className="group rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-6 transition hover:border-[#6366f1]/80"
              >
                <span className="inline-flex rounded-full bg-[#6366f1]/20 px-3 py-1 text-xs font-semibold tracking-wide text-[#a5b4fc]">
                  {item.number}
                </span>
                <div className="mt-5 inline-flex rounded-xl bg-[#6366f1]/15 p-3 text-[#818cf8]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 pb-20 sm:px-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Features That Move You Forward</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: '30-Day Roadmap',
              description: 'A realistic daily path designed to help you build momentum fast.',
              icon: FiTarget,
            },
            {
              title: 'Free Resources Only',
              description: 'Learn from trusted free content: YouTube, docs, and practical guides.',
              icon: FiCheckCircle,
            },
            {
              title: 'Interview Phrases',
              description: 'Get language you can use to explain your projects and readiness.',
              icon: FiZap,
            },
            {
              title: 'Save & Track',
              description: 'Keep your roadmaps organized and monitor your daily progress.',
              icon: FiTrendingUp,
            },
          ].map((feature) => {
            const Icon = feature.icon

            return (
              <article key={feature.title} className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-6">
                <span className="inline-flex rounded-xl bg-gradient-to-br from-[#6366f1] to-[#f59e0b] p-3 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10">
        <div className="rounded-3xl border border-[#6366f1]/30 bg-gradient-to-r from-[#312e81] via-[#3730a3] to-[#1e1b4b] px-8 py-14 text-center shadow-xl shadow-[#312e81]/30 sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to close your skill gaps?</h2>
          <button
            type="button"
            onClick={goToAnalyze}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-semibold text-[#1f2340] transition hover:brightness-95"
          >
            Analyze Your First Job Free
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
