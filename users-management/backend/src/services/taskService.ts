import { db } from "../db.js"
import { tasks } from "../db/schema.js"
import type { Task, CreateTaskBody, UpdateTaskBody } from "../types/task.js"
import { eq } from "drizzle-orm"

class TaskService {
  async getAll(): Promise<Task[]> {
    return await db.select().from(tasks)
  }

  async getById(id: number): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1)
    return task
  }

  async getByProjectId(projectId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
  }

  async create(data: CreateTaskBody): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({
        name: data.name,
        projectId: data.projectId,
        assignedUserId: data.assignedUserId,
        ...(data.status && { status: data.status }),
      })
      .returning()
    if (!newTask) throw new Error("Failed to create task")
    return newTask
  }

  async update(id: number, data: UpdateTaskBody): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning()
    return updated
  }

  async delete(id: number): Promise<Task | undefined> {
    const [deleted] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning()
    return deleted
  }
}

export default TaskService
