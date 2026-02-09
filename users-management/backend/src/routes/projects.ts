import express from "express"
import type { Request, Response } from "express"
import ProjectController from "../controller/projectController.js"
import { requireAuth } from "../middleware/auth.js"

const router = express.Router()
const projectController = new ProjectController()

router.use(requireAuth)

router.get("/", (req: Request, res: Response) => {
    projectController.getAll(req, res)
})

router.get("/:id", (req: Request, res: Response) => {
  projectController.getProjectById(req, res)
})

router.delete("/:id", (req: Request, res: Response) => {
  projectController.deleteProject(req, res)
})

router.patch("/:id", (req: Request, res: Response) => {
  projectController.updateProject(req, res)
})

router.post("/", (req: Request, res: Response) => {
  projectController.createProject(req, res)
})

export default router