export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold text-white hover:text-indigo-300 transition-colors">
          Task Board
        </a>
        <div className="flex gap-4">
          <a href="#users" className="text-sm text-slate-400 hover:text-white transition-colors">
            Users
          </a>
          <a href="#projects" className="text-sm text-slate-400 hover:text-white transition-colors">
            Projects
          </a>
          <a href="#board" className="text-sm text-slate-400 hover:text-white transition-colors">
            Board
          </a>
        </div>
      </div>
    </nav>
  )
}
