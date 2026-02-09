import type { Request, Response } from "express"
import TaskService from "../services/taskService.js"
import ProjectService from "../services/projectService.js"
import type { CreateTaskBody, UpdateTaskBody } from "../types/task.js"

class TaskController {
  private taskService: TaskService
  private projectService: ProjectService

  constructor() {
    this.taskService = new TaskService()
    this.projectService = new ProjectService()
  }

  private async ensureProjectOwnership(projectId: number, userId: number): Promise<boolean> {
    const project = await this.projectService.getProjectByIdForAccess(projectId, userId)
    return project != null
  }

  async getAll(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const projectId = req.query.projectId
      if (projectId == null || projectId === "") {
        return res.status(400).json({ success: false, message: "projectId query is required" })
      }
      const id = Number(projectId)
      if (!id) return res.status(400).json({ success: false, message: "Invalid projectId" })
      const owns = await this.ensureProjectOwnership(id, userId)
      if (!owns) return res.status(404).json({ success: false, message: "Project not found" })
      const tasks = await this.taskService.getByProjectId(id)
      return res.status(200).json(tasks)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async getById(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Task id is required" })
      const task = await this.taskService.getById(id)
      if (!task) return res.status(404).json({ success: false, message: "Task not found" })
      const owns = await this.ensureProjectOwnership(task.projectId, userId)
      if (!owns) return res.status(404).json({ success: false, message: "Task not found" })
      return res.status(200).json(task)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async create(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const { name, projectId, assignedUserId, status } = req.body as CreateTaskBody
      if (!name || projectId == null || assignedUserId == null) {
        return res.status(400).json({
          success: false,
          message: "name, projectId and assignedUserId are required",
        })
      }
      const pid = Number(projectId)
      const owns = await this.ensureProjectOwnership(pid, userId)
      if (!owns) return res.status(404).json({ success: false, message: "Project not found" })
      const task = await this.taskService.create({
        name,
        projectId: pid,
        assignedUserId: Number(assignedUserId),
        ...(status && { status }),
      })
      return res.status(201).json(task)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async update(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Task id is required" })
      const task = await this.taskService.getById(id)
      if (!task) return res.status(404).json({ success: false, message: "Task not found" })
      const owns = await this.ensureProjectOwnership(task.projectId, userId)
      if (!owns) return res.status(404).json({ success: false, message: "Task not found" })
      const body = req.body as UpdateTaskBody
      const updated = await this.taskService.update(id, body)
      return res.status(200).json(updated)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async delete(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Task id is required" })
      const task = await this.taskService.getById(id)
      if (!task) return res.status(404).json({ success: false, message: "Task not found" })
      const owns = await this.ensureProjectOwnership(task.projectId, userId)
      if (!owns) return res.status(404).json({ success: false, message: "Task not found" })
      await this.taskService.delete(id)
      return res.status(200).json({ message: "Task deleted successfully" })
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }
}

export default TaskController
