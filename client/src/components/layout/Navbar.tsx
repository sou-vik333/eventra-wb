import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Eventra <span className="text-purple-600">WB</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
          >
            Home
          </Link>

          <Link
            to="/vendors"
            className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
          >
            Find Services
          </Link>

          <Link
            to="/ai-planner"
            className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
          >
            AI Planner
          </Link>

          <Link
            to="/events"
            className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
          >
            My Events
          </Link>
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>

            <Link
              to="/vendors"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Find Services
            </Link>

            <Link
              to="/ai-planner"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              AI Planner
            </Link>

            <Link
              to="/events"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              My Events
            </Link>

            <div className="mt-3 border-t border-slate-200 pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="mt-2 block rounded-lg bg-purple-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-purple-700"
              >
                Register
              </Link>
            </div>

          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar