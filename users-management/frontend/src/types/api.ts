// Matches your Express API response types
export interface User {
  id: number
  name: string
  age: number
  email?: string
}

/** User returned from login/register (no password) */
export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface Project {
  id: number
  name: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  name: string
  status: TaskStatus
  projectId: number
  assignedUserId: number
}

export interface ApiError {
  message: string
}
