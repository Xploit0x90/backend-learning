import express from "express"
import type { Request, Response } from "express"
import TaskController from "../controller/taskController.js"

const router = express.Router()
const taskController = new TaskController()

router.get("/", (req: Request, res: Response) => {
  taskController.getAll(req, res)
})

router.get("/:id", (req: Request, res: Response) => {
  taskController.getById(req, res)
})

router.post("/", (req: Request, res: Response) => {
  taskController.create(req, res)
})

router.patch("/:id", (req: Request, res: Response) => {
  taskController.update(req, res)
})

router.delete("/:id", (req: Request, res: Response) => {
  taskController.delete(req, res)
})

export default router
