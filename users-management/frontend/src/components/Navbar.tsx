export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/95 backdrop-blur">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold text-white hover:text-indigo-300 transition-colors">
          User App
        </a>
        <div className="flex gap-4">
          <a href="#list" className="text-sm text-slate-400 hover:text-white transition-colors">
            Users
          </a>
          <a href="#search" className="text-sm text-slate-400 hover:text-white transition-colors">
            Search
          </a>
          <a href="#create" className="text-sm text-slate-400 hover:text-white transition-colors">
            Create
          </a>
        </div>
      </div>
    </nav>
  )
}
