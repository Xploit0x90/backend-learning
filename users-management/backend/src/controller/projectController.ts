import type {Request, Response} from "express"
import ProjectService from "../services/projectService.js"


class projectController{
    private projectService: ProjectService;
    constructor(){
        this.projectService = new ProjectService()
    }

    async getAll(req:Request, res:Response){
        try {
            const projects = await this.projectService.getAllProjects()
            return res.status(200).json(projects ?? [])
        } catch(error){
                return res.status(500).json({success:false, message:"Server Error"})
            }
    }

    async createProject(req:Request, res:Response){
        try{
            const name = req.body.name
            if(!name){
                return res.status(400).json({success:false, message:"Project name is required!"})
            }
            const newProject = await this.projectService.createProject(name)
            return res.status(201).json(newProject)
        } catch(error){
            return res.status(500).json({success:false, message:"Server Error"})
        }
    }

    async getProjectById(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            if(!id){
                return res.status(404).json({success:false, message:"Project id is required!"})
            }
            const searchProject = await this.projectService.getProjectById(id)
            return res.status(200).json(searchProject)
        } catch(error){
            return res.status(500).json({success:false, message:"Server Error"})
        }
    }

    async deleteProject(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            if(!id){
                return res.status(404).json({success:false, message:"Project id is required!"})
            }
            const searchProject = await this.projectService.deleteProject(id)
            return res.status(200).json({message:"Project deleted successfully"})
        } catch(error){
            return res.status(500).json({success:false, message:"Server Error"})
        }
    }

    async updateProject(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const name = req.body.name
            if(!id){
                return res.status(404).json({success:false, message:"Project id is required!"})
            }
            const searchProject = await this.projectService.updateProject(id, name)
            return res.status(200).json({message:"Project updated successfully"})
        } catch(error){
            return res.status(500).json({success:false, message:"Server Error"})
        }
    }
}

export default projectController