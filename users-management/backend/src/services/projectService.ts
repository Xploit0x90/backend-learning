import { db } from "../db.js"
import { projects } from "../db/schema.js"
import type { Project } from "../types/project.js"
import { eq, and, or, isNull } from "drizzle-orm"

class ProjectService {
  async getAllProjects(userId: number): Promise<Project[]> {
    return await db
      .select({ id: projects.id, name: projects.name })
      .from(projects)
      .where(eq(projects.userId, userId))
  }

  async getProjectById(id: number, userId: number): Promise<Project | undefined> {
    const [project] = await db
      .select({ id: projects.id, name: projects.name, userId: projects.userId })
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .limit(1)
    return project
  }

  /** Returns project if it exists and user owns it or project has no owner (legacy). */
  async getProjectByIdForAccess(id: number, userId: number): Promise<Project | undefined> {
    const [project] = await db
      .select({ id: projects.id, name: projects.name, userId: projects.userId })
      .from(projects)
      .where(and(eq(projects.id, id), or(eq(projects.userId, userId), isNull(projects.userId))))
      .limit(1)
    return project
  }

  async createProject(userId: number, name: string): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({ name, userId })
      .returning({ id: projects.id, name: projects.name })
    if (!newProject) throw new Error("Failed to create project")
    return newProject
  }

  async deleteProject(id: number, userId: number): Promise<Project | undefined> {
    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning({ id: projects.id, name: projects.name })
    return deleted
  }

  async updateProject(id: number, userId: number, name: string): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ name })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning({ id: projects.id, name: projects.name })
    return updated
  }
}

export default ProjectService