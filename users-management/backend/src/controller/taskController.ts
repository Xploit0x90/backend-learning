import type { Request, Response } from "express"
import TaskService from "../services/taskService.js"
import type { CreateTaskBody, UpdateTaskBody } from "../types/task.js"

class TaskController {
  private taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
  }

  async getAll(req: Request, res: Response) {
    try {
      const projectId = req.query.projectId
      let tasks
      if (projectId != null && projectId !== "") {
        const id = Number(projectId)
        if (!id) return res.status(400).json({ success: false, message: "Invalid projectId" })
        tasks = await this.taskService.getByProjectId(id)
      } else {
        tasks = await this.taskService.getAll()
      }
      return res.status(200).json(tasks)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Task id is required" })
      const task = await this.taskService.getById(id)
      if (!task) return res.status(404).json({ success: false, message: "Task not found" })
      return res.status(200).json(task)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, projectId, assignedUserId, status } = req.body as CreateTaskBody
      if (!name || projectId == null || assignedUserId == null) {
        return res.status(400).json({
          success: false,
          message: "name, projectId and assignedUserId are required",
        })
      }
      const task = await this.taskService.create({
        name,
        projectId: Number(projectId),
        assignedUserId: Number(assignedUserId),
        ...(status && { status }),
      })
      return res.status(201).json(task)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Task id is required" })
      const body = req.body as UpdateTaskBody
      const task = await this.taskService.update(id, body)
      if (!task) return res.status(404).json({ success: false, message: "Task not found" })
      return res.status(200).json(task)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Task id is required" })
      const task = await this.taskService.delete(id)
      if (!task) return res.status(404).json({ success: false, message: "Task not found" })
      return res.status(200).json({ message: "Task deleted successfully" })
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }
}

export default TaskController
