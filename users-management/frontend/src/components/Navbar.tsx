import type { AuthUser } from '../types/api'

interface NavbarProps {
  token: string | null
  currentUser: AuthUser | null
  onLogout: () => void
}

export function Navbar({ token, currentUser, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold tracking-tight text-white hover:text-indigo-300 transition-colors">
          Task Board
        </a>
        <div className="flex items-center gap-6">
          <a href="#users" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Users
          </a>
          <a href="#projects" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Projects
          </a>
          <a href="#board" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Board
          </a>
          {token && currentUser ? (
            <span className="flex items-center gap-3 pl-4 border-l border-slate-600">
              <span className="text-sm text-slate-300">{currentUser.name}</span>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 rounded-md bg-slate-600/80 text-white text-sm font-medium hover:bg-slate-500 transition-colors"
              >
                Logout
              </button>
            </span>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
