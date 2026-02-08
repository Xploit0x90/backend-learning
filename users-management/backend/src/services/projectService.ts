import {db} from "../db.js"
import {projects} from "../db/schema.js"
import type {Project} from "../types/project.js"
import {eq} from "drizzle-orm"

class ProjectService{
    constructor(){}
    
    async getAllProjects():Promise<Project[]>{
        return await db
            .select()
            .from(projects)
    }

    async getProjectById(id:number):Promise<Project|undefined>{
        const [searchProject] = await db
            .select()
            .from(projects)
            .where(eq(projects.id, id))
            .limit(1)
        return searchProject
    }

    async createProject(name:string): Promise<Project>{
        const [newProject] = await db
            .insert(projects)
            .values({name})
            .returning();
        if(!newProject) throw new Error("failed to create a project")
        return {id: newProject.id, name: newProject.name}
    }

    async deleteProject(id:number):Promise<Project|undefined>{
        const [deleted] = await db
            .delete(projects)
            .where(eq(projects.id, id))
            .returning({id:projects.id, name:projects.name})
        return deleted;
    }

    async updateProject(id:number, name:string):Promise<Project|undefined>{
        const [updated] = await db
            .update(projects)
            .set({name})
            .where(eq(projects.id,id))
            .returning({id:projects.id, name:projects.name})
        return updated
    }
}

export default ProjectService