import UserService from "../services/userService.js"
import type {Request, Response, NextFunction} from "express";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req:Request, res:Response){
        try{
        const {name, age} = req.body
        const newUser = await this.userService.create(name, Number(age))
        res.status(201).json(newUser)}
        catch(error){
            res.status(400).json({success: false, error: error})
        }
    }

    async getAll(req:Request, res:Response){
        try{
            const users = await this.userService.getAll();
            if(!users || users.length === 0){
                res.status(404).json({success:false, message:"No users found"})
            }
            return res.status(200).json(users)

        }catch(error){
            return res.status(500).json({success:false, error : error})
        }
    }

    async getById(req:Request, res:Response){
        try{
            const id = req.params.id
            const user = await this.userService.getById(Number(id))
            if(!user){
                return res.status(404).json({success:false, message: "Not user found"})
            }
            return res.status(200).json(user)
        }
        catch(error){
            return res.status(500).json({success: false, message:"Server error"})
        }
    }

    async getByName(req:Request, res:Response){
        try{
            const name = req.query.name;
            const nameStr = typeof name === "string" ? name : undefined;
            if (nameStr === undefined) {
                return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });
            }
            const users = await this.userService.getByName(nameStr);
            if(!users){
                return res.status(404).json({success:false, message: "Not user found"})
            }
            return res.status(200).json(users)
        }catch(error){
            return res.status(500).json({success: false, message:"Server error"})
        }
    }

}

export default UserController