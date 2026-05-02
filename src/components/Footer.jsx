import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-[#2a2a3a] bg-[#0f0f13]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-gray-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>SkillSnap — Built for students, by a student</p>
        <div className="flex items-center gap-4">
          <Link to="/analyze" className="hover:text-white">
            Analyze
          </Link>
          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
        </div>
        <p>Powered by OpenRouter AI • Free forever</p>
      </div>
    </footer>
  )
}

export default Footer
