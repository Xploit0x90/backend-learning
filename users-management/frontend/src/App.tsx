import { useState } from 'react'
import type { User, ApiError } from './types/api'
import { Navbar } from './components/Navbar'

function App() {
  const [users, setUsers] = useState<User[] | null>(null)
  const [searchResult, setSearchResult] = useState<User[] | ApiError | null>(null)
  const [created, setCreated] = useState<User | null>(null)
  const [searchName, setSearchName] = useState('')
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadUsers() {
    setLoading('list')
    setError(null)
    setUsers(null)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setUsers(data as User[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  async function searchUser() {
    const name = searchName.trim()
    if (!name) return
    setLoading('search')
    setError(null)
    setSearchResult(null)
    try {
      const res = await fetch(`/api/user?name=${encodeURIComponent(name)}`)
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setSearchResult(Array.isArray(data) ? (data as User[]) : [])
    } catch (e) {
      setSearchResult({ message: e instanceof Error ? e.message : 'Request failed' })
    } finally {
      setLoading(null)
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    const age = Number(newAge)
    if (!name || !Number.isInteger(age) || age < 1) return
    setLoading('create')
    setError(null)
    setCreated(null)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setCreated(data as User)
      setNewName('')
      setNewAge('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-8">
        <header className="text-center pt-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">User App</h1>
          <p className="text-slate-400 mt-1">React + Vite + TypeScript + Tailwind → Express API</p>
        </header>

        {/* List users */}
        <section id="list" className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 shadow-xl scroll-mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">List all users</h2>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading === 'list'}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'list' ? 'Loading…' : 'Load users'}
          </button>
          {users !== null && (
            <div className="mt-4 rounded-lg bg-slate-800 p-4 border border-slate-600/50">
              {users.length === 0 ? (
                <p className="text-slate-400">No users yet.</p>
              ) : (
                <ul className="space-y-2">
                  {users.map((u) => (
                    <li key={u.id} className="flex gap-3 text-sm">
                      <span className="text-slate-500 font-mono">#{u.id}</span>
                      <span className="font-medium text-white">{u.name}</span>
                      <span className="text-slate-400">age {u.age}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Search by name */}
        <section id="search" className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 shadow-xl scroll-mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">Search by name</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g. mo"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={searchUser}
              disabled={loading === 'search' || !searchName.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading === 'search' ? 'Searching…' : 'Search'}
            </button>
          </div>
          {searchResult !== null && (
            <div className="mt-4 rounded-lg bg-slate-800 p-4 border border-slate-600/50">
              {'message' in searchResult ? (
                <p className="text-red-400 text-sm">{searchResult.message}</p>
              ) : searchResult.length === 0 ? (
                <p className="text-slate-400">No users found with that name.</p>
              ) : (
                <ul className="space-y-2">
                  {searchResult.map((u) => (
                    <li key={u.id} className="flex gap-3 text-sm">
                      <span className="text-slate-500 font-mono">#{u.id}</span>
                      <span className="font-medium text-white">{u.name}</span>
                      <span className="text-slate-400">age {u.age}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Create user */}
        <section id="create" className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 shadow-xl scroll-mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">Create user</h2>
          <form onSubmit={createUser} className="flex flex-wrap gap-2 items-end">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              placeholder="Age"
              min={1}
              className="w-24 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading === 'create' || !newName.trim() || !newAge.trim()}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading === 'create' ? 'Creating…' : 'Create'}
            </button>
          </form>
          {created && (
            <p className="mt-4 text-sm text-emerald-400">
              Created: <span className="font-medium text-white">{created.name}</span> (id {created.id}, age {created.age})
            </p>
          )}
        </section>

        {error && (
          <div className="rounded-lg bg-red-900/30 border border-red-700/50 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
