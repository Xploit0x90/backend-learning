import type { Request, Response } from "express"
import ProjectService from "../services/projectService.js"

class projectController {
  private projectService: ProjectService
  constructor() {
    this.projectService = new ProjectService()
  }

  async getAll(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const projects = await this.projectService.getAllProjects(userId)
      return res.status(200).json(projects ?? [])
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async createProject(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const name = req.body.name
      if (!name) return res.status(400).json({ success: false, message: "Project name is required!" })
      const newProject = await this.projectService.createProject(userId, name)
      return res.status(201).json(newProject)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async getProjectById(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Project id is required!" })
      const project = await this.projectService.getProjectById(id, userId)
      if (!project) return res.status(404).json({ success: false, message: "Project not found" })
      return res.status(200).json(project)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async deleteProject(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: "Project id is required!" })
      const deleted = await this.projectService.deleteProject(id, userId)
      if (!deleted) return res.status(404).json({ success: false, message: "Project not found" })
      return res.status(200).json({ message: "Project deleted successfully" })
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }

  async updateProject(req: Request, res: Response) {
    const userId = req.user?.userId
    if (userId == null) return res.status(401).json({ success: false, message: "Authentication required" })
    try {
      const id = Number(req.params.id)
      const name = req.body.name
      if (!id) return res.status(400).json({ success: false, message: "Project id is required!" })
      if (!name) return res.status(400).json({ success: false, message: "Project name is required!" })
      const updated = await this.projectService.updateProject(id, userId, name)
      if (!updated) return res.status(404).json({ success: false, message: "Project not found" })
      return res.status(200).json(updated)
    } catch {
      return res.status(500).json({ success: false, message: "Server Error" })
    }
  }
}

export default projectController