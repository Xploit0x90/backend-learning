export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  name: string
  status: TaskStatus
  projectId: number
  assignedUserId: number
}

export interface CreateTaskBody {
  name: string
  projectId: number
  assignedUserId: number
  status?: TaskStatus
}

export interface UpdateTaskBody {
  name?: string
  status?: TaskStatus
  assignedUserId?: number
}
