import { useState } from 'react'
import { FiMenu, FiX, FiZap } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/dashboard', label: 'Dashboard' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(15,15,19,0.78)] backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-[rgba(99,102,241,0.2)] p-2 text-[var(--color-primary)]">
            <FiZap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Skill<span className="text-[var(--color-primary)]">Snap</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-gray-100 transition hover:border-[var(--color-primary)] hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Signup
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-[var(--color-border)] p-2 text-gray-100 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-[var(--color-border)] bg-[rgba(26,26,36,0.92)] px-4 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="rounded-md px-2 py-2 text-sm font-medium text-gray-200 hover:bg-[rgba(99,102,241,0.15)] hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              <Link
                to="/login"
                className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-center text-sm font-medium text-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
