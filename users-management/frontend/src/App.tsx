import { useState, useEffect } from 'react'
import type { User, Project, Task, TaskStatus, ApiError } from './types/api'
import { Navbar } from './components/Navbar'

const API = {
  users: '/api/users',
  userSearch: (name: string) => `/api/users?name=${encodeURIComponent(name)}`,
  projects: '/api/projects',
  project: (id: number) => `/api/projects/${id}`,
  tasks: '/api/tasks',
  tasksByProject: (projectId: number) => `/api/tasks?projectId=${projectId}`,
  task: (id: number) => `/api/tasks/${id}`,
}

function App() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Users
  const [users, setUsers] = useState<User[] | null>(null)
  const [searchResult, setSearchResult] = useState<User[] | ApiError | null>(null)
  const [createdUser, setCreatedUser] = useState<User | null>(null)
  const [searchName, setSearchName] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserAge, setNewUserAge] = useState('')

  // Projects
  const [projects, setProjects] = useState<Project[]>([])
  const [projectName, setProjectName] = useState('')
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [editingProjectName, setEditingProjectName] = useState('')
  const [busyProjectId, setBusyProjectId] = useState<number | null>(null)

  // Task board
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskName, setTaskName] = useState('')
  const [taskAssigneedId, setTaskAssigneedId] = useState<number | ''>('')
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null)

  async function loadUsers() {
    setLoading('users')
    setError(null)
    setUsers(null)
    try {
      const res = await fetch(API.users)
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
      const res = await fetch(API.userSearch(name))
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
    const name = newUserName.trim()
    const age = Number(newUserAge)
    if (!name || !Number.isInteger(age) || age < 1) return
    setLoading('createUser')
    setError(null)
    setCreatedUser(null)
    try {
      const res = await fetch(API.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setCreatedUser(data as User)
      setNewUserName('')
      setNewUserAge('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  async function loadProjects() {
    setLoading('projects')
    setError(null)
    try {
      const res = await fetch(API.projects)
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setProjects(data as Project[])
      if (selectedProjectId && !(data as Project[]).some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    const name = projectName.trim()
    if (!name) return
    setLoading('createProject')
    setError(null)
    try {
      const res = await fetch(API.projects, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setProjects((prev) => [...prev, data as Project])
      setProjectName('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  async function updateProject(e: React.FormEvent) {
    e.preventDefault()
    if (editingProjectId == null) return
    const name = editingProjectName.trim()
    if (!name) return
    setBusyProjectId(editingProjectId)
    setError(null)
    try {
      const res = await fetch(API.project(editingProjectId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? (data as Project) : p)))
      setEditingProjectId(null)
      setEditingProjectName('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setBusyProjectId(null)
    }
  }

  async function deleteProject(id: number) {
    setBusyProjectId(id)
    setError(null)
    try {
      const res = await fetch(API.project(id), { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error((data as ApiError).message ?? res.statusText)
      }
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (selectedProjectId === id) {
        setSelectedProjectId(null)
        setTasks([])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setBusyProjectId(null)
    }
  }

  async function loadTasks() {
    if (selectedProjectId == null) return
    setLoading('tasks')
    setError(null)
    try {
      const res = await fetch(API.tasksByProject(selectedProjectId))
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setTasks(Array.isArray(data) ? (data as Task[]) : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  // Load projects on mount so Board dropdown is populated
  useEffect(() => {
    async function init() {
      setError(null)
      try {
        const res = await fetch(API.projects)
        const data = await res.json()
        if (res.ok) setProjects(data as Project[])
      } catch {
        // ignore init errors
      }
    }
    init()
  }, [])

  // Load tasks when project is selected
  useEffect(() => {
    if (selectedProjectId == null) {
      setTasks([])
      return
    }
    let cancelled = false
    setLoading('tasks')
    setError(null)
    fetch(API.tasksByProject(selectedProjectId))
      .then((res) => {
        if (cancelled) return res.json().then(() => ({}))
        if (!res.ok) throw new Error('Failed to load tasks')
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setTasks(Array.isArray(data) ? (data as Task[]) : [])
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load tasks')
      })
      .finally(() => {
        if (!cancelled) setLoading(null)
      })
    return () => { cancelled = true }
  }, [selectedProjectId])

  // Auto-load users when a project is selected (for assignee dropdown)
  useEffect(() => {
    if (selectedProjectId == null || users != null) return
    let cancelled = false
    fetch(API.users)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data)) setUsers(data as User[])
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [selectedProjectId])

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (selectedProjectId == null) return
    const name = taskName.trim()
    const assignedUserId = taskAssigneedId === '' ? null : Number(taskAssigneedId)
    if (!name || assignedUserId == null || assignedUserId < 1) return
    setLoading('createTask')
    setError(null)
    try {
      const res = await fetch(API.tasks, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, projectId: selectedProjectId, assignedUserId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setTasks((prev) => [...prev, data as Task])
      setTaskName('')
      setTaskAssigneedId('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(null)
    }
  }

  async function moveTask(taskId: number, newStatus: TaskStatus) {
    setLoadingTaskId(taskId)
    setError(null)
    try {
      const res = await fetch(API.task(taskId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as ApiError).message ?? res.statusText)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? (data as Task) : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoadingTaskId(null)
    }
  }

  async function deleteTask(taskId: number) {
    setLoadingTaskId(taskId)
    setError(null)
    try {
      const res = await fetch(API.task(taskId), { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error((data as ApiError).message ?? res.statusText)
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoadingTaskId(null)
    }
  }

  const userById: Record<number, User> = {}
  if (users) users.forEach((u) => (userById[u.id] = u))
  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'To do' },
    { status: 'in_progress', label: 'In progress' },
    { status: 'done', label: 'Done' },
  ]

  const inputClass =
    'px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
  const btnPrimary =
    'px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
  const btnDanger =
    'px-3 py-1.5 rounded-lg bg-red-600/80 text-white text-sm hover:bg-red-500 disabled:opacity-50 transition-colors'
  const sectionClass = 'rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 shadow-xl scroll-mt-6'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <header className="text-center pt-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Task Board</h1>
          <p className="text-slate-400 mt-1">Projects & tasks · Assign to users</p>
        </header>

        {/* Users */}
        <section id="users" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white mb-4">Users</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">List</h3>
              <button
                type="button"
                onClick={loadUsers}
                disabled={loading === 'users'}
                className={btnPrimary}
              >
                {loading === 'users' ? 'Loading…' : 'Load users'}
              </button>
              {users !== null && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {users.length === 0 ? (
                    <li className="text-slate-400">No users.</li>
                  ) : (
                    users.map((u) => (
                      <li key={u.id} className="flex gap-2">
                        <span className="text-slate-500 font-mono">#{u.id}</span>
                        <span className="text-white">{u.name}</span>
                        <span className="text-slate-400">({u.age})</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Search</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Name"
                  className={inputClass + ' flex-1'}
                />
                <button
                  type="button"
                  onClick={searchUser}
                  disabled={loading === 'search' || !searchName.trim()}
                  className={btnPrimary}
                >
                  Search
                </button>
              </div>
              {searchResult !== null && (
                <div className="mt-2">
                  {'message' in searchResult ? (
                    <p className="text-red-400 text-sm">{searchResult.message}</p>
                  ) : (searchResult as User[]).length === 0 ? (
                    <p className="text-slate-400 text-sm">No users found.</p>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {(searchResult as User[]).map((u) => (
                        <li key={u.id}>
                          #{u.id} {u.name} ({u.age})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Create user</h3>
              <form onSubmit={createUser} className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Name"
                  className={inputClass}
                />
                <input
                  type="number"
                  value={newUserAge}
                  onChange={(e) => setNewUserAge(e.target.value)}
                  placeholder="Age"
                  min={1}
                  className={inputClass + ' w-20'}
                />
                <button
                  type="submit"
                  disabled={loading === 'createUser' || !newUserName.trim() || !newUserAge.trim()}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50"
                >
                  Create
                </button>
              </form>
              {createdUser && (
                <p className="mt-2 text-sm text-emerald-400">
                  Created {createdUser.name} (id {createdUser.id})
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white mb-4">Projects</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={loadProjects}
              disabled={loading === 'projects'}
              className={btnPrimary}
            >
              {loading === 'projects' ? 'Loading…' : 'Load projects'}
            </button>
            <form onSubmit={createProject} className="flex gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="New project name"
                className={inputClass + ' min-w-[180px]'}
              />
              <button
                type="submit"
                disabled={loading === 'createProject' || !projectName.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50"
              >
                Create project
              </button>
            </form>
          </div>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg bg-slate-800 p-3 border border-slate-600/50"
              >
                {editingProjectId === p.id ? (
                  <form onSubmit={updateProject} className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editingProjectName}
                      onChange={(e) => setEditingProjectName(e.target.value)}
                      className={inputClass + ' flex-1'}
                      autoFocus
                    />
                    <button type="submit" disabled={busyProjectId === p.id} className={btnPrimary}>
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingProjectId(null); setEditingProjectName('') }}
                      className="px-4 py-2 rounded-lg bg-slate-600 text-white hover:bg-slate-500"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="font-medium text-white flex-1">{p.name}</span>
                    <span className="text-slate-500 text-sm font-mono">#{p.id}</span>
                    <button
                      type="button"
                      onClick={() => { setEditingProjectId(p.id); setEditingProjectName(p.name) }}
                      className="px-3 py-1.5 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(p.id)}
                      disabled={busyProjectId === p.id}
                      className={btnDanger}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Task board */}
        <section id="board" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white mb-4">Task board</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <label className="text-slate-400 text-sm">Project:</label>
            <select
              value={selectedProjectId ?? ''}
              onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
              className={inputClass + ' min-w-[200px]'}
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {projects.length === 0 && (
              <span className="text-slate-400 text-sm">Load or create projects above.</span>
            )}
            {selectedProjectId != null && (
              <button
                type="button"
                onClick={loadTasks}
                disabled={loading === 'tasks'}
                className="px-3 py-1.5 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-500"
              >
                Refresh tasks
              </button>
            )}
          </div>

          {selectedProjectId != null && (
            <>
              {users == null && (
                <p className="mb-2 text-sm text-slate-400">Loading users for assignee list…</p>
              )}
              {users != null && users.length === 0 && (
                <p className="mb-2 text-sm text-amber-400">
                  No users yet. Create users in the Users section to assign tasks.
                </p>
              )}
              <form onSubmit={createTask} className="flex flex-wrap gap-2 mb-6">
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Task name"
                  className={inputClass + ' min-w-[160px]'}
                />
                <select
                  value={taskAssigneedId}
                  onChange={(e) => setTaskAssigneedId(e.target.value === '' ? '' : Number(e.target.value))}
                  className={inputClass}
                >
                  <option value="">Assign to…</option>
                  {(users ?? []).map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} (#{u.id})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={
                    loading === 'createTask' ||
                    !taskName.trim() ||
                    taskAssigneedId === '' ||
                    (users != null && users.length === 0)
                  }
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50"
                >
                  Add task
                </button>
              </form>

              {loading === 'tasks' ? (
                <p className="text-slate-400">Loading tasks…</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {columns.map((col) => (
                    <div
                      key={col.status}
                      className="rounded-xl bg-slate-800/80 border border-slate-600/50 p-4 min-h-[200px]"
                    >
                      <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                        {col.label}
                      </h3>
                      <ul className="space-y-2">
                        {tasks
                          .filter((t) => t.status === col.status)
                          .map((t) => (
                            <li
                              key={t.id}
                              className="rounded-lg bg-slate-700/80 border border-slate-600/50 p-3 flex flex-col gap-2"
                            >
                              <span className="font-medium text-white">{t.name}</span>
                              <span className="text-slate-400 text-sm">
                                → {userById[t.assignedUserId]?.name ?? `User #${t.assignedUserId}`}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {columns
                                  .filter((c) => c.status !== t.status)
                                  .map((c) => (
                                    <button
                                      key={c.status}
                                      type="button"
                                      onClick={() => moveTask(t.id, c.status)}
                                      disabled={loadingTaskId === t.id}
                                      className="px-2 py-1 rounded bg-slate-600 text-white text-xs hover:bg-slate-500 disabled:opacity-50"
                                    >
                                      → {c.label}
                                    </button>
                                  ))}
                                <button
                                  type="button"
                                  onClick={() => deleteTask(t.id)}
                                  disabled={loadingTaskId === t.id}
                                  className="ml-auto px-2 py-1 rounded bg-red-600/80 text-white text-xs hover:bg-red-500 disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-900/30 border border-red-700/50 p-4 text-red-300 text-sm flex items-center justify-between gap-4"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 px-2 py-1 rounded bg-red-800/50 hover:bg-red-700/50 text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
