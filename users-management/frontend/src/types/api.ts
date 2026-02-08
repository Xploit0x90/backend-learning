// Matches your Express API response types
export interface User {
  id: number
  name: string
  age: number
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
